import { NextRequest, NextResponse } from "next/server";
import { sanitizeForPrompt, checkRateLimit, getClientIp, checkCsrfOrigin } from "../../lib/security";
import { logger } from "../../lib/logger";

export const dynamic = "force-dynamic";

export interface VaultDocument {
  id: string;
  name: string;
  type: string;
  status: "draft" | "in_review" | "pending_approval" | "approved" | "rejected";
  owner: string;
  daysInStatus: number;
  product: string;
  version: string;
}

const MOCK_VAULT_DOCUMENTS: VaultDocument[] = [
  {
    id: "VLT-2026-001",
    name: "IMP-PRAME-001 Manufacturing Batch Record",
    type: "Batch Record",
    status: "pending_approval",
    owner: "Manufacturing QA",
    daysInStatus: 5,
    product: "PRAME-TCR T-Cell Therapy",
    version: "v2.1",
  },
  {
    id: "VLT-2026-002",
    name: "Clinical Study Protocol CS-204 Amendment 3",
    type: "Clinical Protocol",
    status: "in_review",
    owner: "Clinical Operations",
    daysInStatus: 12,
    product: "IMA203",
    version: "v3.0",
  },
  {
    id: "VLT-2026-003",
    name: "CMC Module 3.2.S Drug Substance Specification",
    type: "Regulatory Submission",
    status: "pending_approval",
    owner: "Regulatory Affairs",
    daysInStatus: 3,
    product: "IMA401",
    version: "v1.4",
  },
  {
    id: "VLT-2026-004",
    name: "Leukapheresis SOP-MFG-088 Rev C",
    type: "SOP",
    status: "in_review",
    owner: "Cell Therapy Manufacturing",
    daysInStatus: 8,
    product: "ACTengine Platform",
    version: "Rev C",
  },
  {
    id: "VLT-2026-005",
    name: "GMP Deviation Report DEV-2026-047",
    type: "Deviation Report",
    status: "pending_approval",
    owner: "QA",
    daysInStatus: 2,
    product: "IMA203",
    version: "v1.0",
  },
  {
    id: "VLT-2026-006",
    name: "Stability Study Protocol STAB-2026-012",
    type: "Study Protocol",
    status: "draft",
    owner: "Analytical Development",
    daysInStatus: 1,
    product: "IMA401",
    version: "v1.0",
  },
];

export async function GET(req: NextRequest) {
  // Rate limit: 60 fetches per IP per hour (page loads only)
  const ip = getClientIp(req);
  if (!checkRateLimit(`veeva-get:${ip}`, 60, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  // Only serve to same-origin browser requests
  if (!checkCsrfOrigin(req)) {
    logger.warn("veeva-agent-get", "CSRF origin rejected", { origin: req.headers.get("origin") });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ documents: MOCK_VAULT_DOCUMENTS });
}

export async function POST(req: NextRequest) {
  // Rate limit: 30 requests per IP per hour
  const ip = getClientIp(req);
  if (!checkRateLimit(`veeva-agent:${ip}`, 30, 60 * 60 * 1000)) {
    return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
  }

  try {
    const Groq = (await import("groq-sdk")).default;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY ?? "" });

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
    }

    const { documentId } = body as Record<string, unknown>;

    // Validate documentId against the known list — never pass raw user input into the prompt
    if (typeof documentId !== "string" || !/^VLT-\d{4}-\d{3}$/.test(documentId)) {
      return NextResponse.json({ success: false, error: "Invalid document ID" }, { status: 400 });
    }

    const doc = MOCK_VAULT_DOCUMENTS.find((d) => d.id === documentId);
    if (!doc) {
      return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 });
    }

    // All values interpolated into the prompt come from the trusted MOCK array,
    // not from user input, so sanitizeForPrompt is a belt-and-suspenders measure.
    const s = (v: string) => sanitizeForPrompt(v, 300);

    const prompt = `You are an AI agent monitoring a Veeva Vault document management system for a cell therapy biotech company (immatics).

Analyze this Vault document and determine the appropriate action:

Document ID: ${s(doc.id)}
Document Name: ${s(doc.name)}
Type: ${s(doc.type)}
Current Status: ${s(doc.status)}
Days in Current Status: ${doc.daysInStatus}
Owner: ${s(doc.owner)}
Product: ${s(doc.product)}
Version: ${s(doc.version)}

Based on this analysis, provide:
1. RISK LEVEL: (Low / Medium / High / Critical)
2. RECOMMENDED ACTION: (one of: Auto-Approve | Route to QA Director | Escalate to VP Regulatory | Send Reminder | Flag for Review | Initiate CAPA)
3. ROUTING TARGET: (specific role/person to route to)
4. REASON: (2-3 sentences explaining why)
5. AUDIT NOTE: (one professional sentence for the audit trail)

Respond in this exact JSON format:
{
  "riskLevel": "...",
  "action": "...",
  "routingTarget": "...",
  "reason": "...",
  "auditNote": "..."
}`;

    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content ?? "{}");

    const auditEntry = {
      timestamp: new Date().toISOString(),
      documentId: doc.id,
      documentName: doc.name,
      agentAction: result.action,
      riskLevel: result.riskLevel,
      routingTarget: result.routingTarget,
      reason: result.reason,
      auditNote: result.auditNote,
    };

    return NextResponse.json({ success: true, document: doc, result: auditEntry });
    logger.info("veeva-agent", "Document processed", { documentId, action: result.action, risk: result.riskLevel });
    return NextResponse.json({ success: true, document: doc, result: auditEntry });
  } catch (err: unknown) {
    logger.error("veeva-agent", "Agent processing failed", { err: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ success: false, error: "Agent processing failed" }, { status: 500 });
  }
}
