import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { sanitizeForPrompt, checkRateLimit, getClientIp, checkCsrfOrigin } from "../../lib/security";

export const dynamic = "force-dynamic";

const DEPARTMENTS = [
  "Cell Therapy Manufacturing",
  "Quality Control Lab",
  "Engineering",
  "Facilities",
  "Supply Chain",
  "Regulatory Affairs",
  "Clinical Operations",
];

const OQA_APPROVERS = [
  "Ryan Garrick-Horton — Principal OQA Specialist",
  "OQA Director",
  "Senior Quality Assurance Specialist",
];

function generateDeviationId(): string {
  const num = Math.floor(Math.random() * 900) + 100;
  return `DEV-2026-${num}`;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`immatics-dev:${ip}`, 20, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  if (!checkCsrfOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const description   = sanitizeForPrompt(String(body.description   ?? ""), 1000);
  const department    = sanitizeForPrompt(String(body.department     ?? ""), 100);
  const product       = sanitizeForPrompt(String(body.product        ?? ""), 100);
  const batchNumber   = sanitizeForPrompt(String(body.batchNumber    ?? ""), 50);
  const location      = sanitizeForPrompt(String(body.location       ?? ""), 100);
  const immediateActions = sanitizeForPrompt(String(body.immediateActions ?? ""), 500);

  if (!description || !department) {
    return NextResponse.json({ error: "Description and department are required" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `You are an AI Quality Assurance agent for immatics US, Inc. — a clinical-stage cell therapy biotech in Stafford, TX.
You are the "Front Gate" for Veeva Vault deviations, applying the Deviation Decision Tree and GMP SOPs.

An event has been reported. Analyze it and return a JSON response.

EVENT DETAILS:
- Description: ${description}
- Reporting Department: ${department}
- Product/Batch: ${product} / ${batchNumber}
- Location: ${location}
- Immediate Actions Taken: ${immediateActions}

Apply the Deviation Decision Tree:
1. Does this event represent a departure from an approved procedure, specification, or regulatory requirement?
2. If yes — what is the criticality? (Critical = patient safety/product quality directly impacted; Major = significant GMP impact but no immediate patient risk; Minor = minor procedural departure, low risk)
3. Generate a concise, professional deviation title (max 80 chars, GMP language)
4. Identify the root cause category
5. Assign an owner from the reporting department
6. Generate a Teams notification message to the owner
7. Generate an Outlook email subject + body to the OQA approver

Respond ONLY with this exact JSON (no markdown, no extra text):
{
  "isDeviation": true or false,
  "deviationRationale": "1-2 sentence explanation of why this is or isn't a deviation",
  "criticality": "Critical" or "Major" or "Minor" or "N/A",
  "criticalityRationale": "1-2 sentence explanation of criticality level",
  "deviationTitle": "Professional GMP deviation title (max 80 chars)",
  "rootCauseCategory": "Human Error" or "Equipment/Instrument" or "Process/Method" or "Material/Reagent" or "Environmental" or "Training" or "System/Software" or "Unknown - Under Investigation",
  "ownerName": "Generated plausible first/last name",
  "ownerTitle": "Plausible title matching the department",
  "oqaApprover": "Senior OQA Specialist",
  "teamsMessage": "Short Teams notification to owner (3-4 sentences, professional)",
  "emailSubject": "Outlook email subject line to OQA approver",
  "emailBody": "3-4 paragraph professional email to OQA approver about this deviation"
}`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    // Strip markdown code fences if Claude wraps the JSON despite instructions
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
    const result = JSON.parse(cleaned);

    const deviationId = generateDeviationId();
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    return NextResponse.json({
      deviationId,
      isDeviation: result.isDeviation,
      deviationRationale: result.deviationRationale,
      criticality: result.criticality,
      criticalityRationale: result.criticalityRationale,
      deviationTitle: result.deviationTitle,
      rootCauseCategory: result.rootCauseCategory,
      department,
      product,
      batchNumber,
      location,
      description,
      immediateActions,
      ownerName: result.ownerName,
      ownerTitle: result.ownerTitle,
      oqaApprover: result.oqaApprover || OQA_APPROVERS[0],
      teamsMessage: result.teamsMessage,
      emailSubject: result.emailSubject,
      emailBody: result.emailBody,
      dateCreated: dateStr,
      timeCreated: timeStr,
      status: "Awaiting Owner Completion",
    });
  } catch (err) {
    console.error("immatics-deviation error:", err);
    return NextResponse.json({ error: "Agent processing failed" }, { status: 500 });
  }
}
