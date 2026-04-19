export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Claude helper ────────────────────────────────────────────────────────────
async function askClaude(system: string, user: string): Promise<string> {
  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system,
    messages: [{ role: "user", content: user }],
  });
  return msg.content.filter((b) => b.type === "text").map((b) => (b as { type: "text"; text: string }).text).join("");
}

// ── Build a fresh McpServer per request (stateless) ─────────────────────────
function buildAgentNXServer() {
  const s = new McpServer({
    name: "agentnx",
    version: "1.0.0",
  });

  // ── Tool 1: Triage a security alert ───────────────────────────────────────
  s.tool(
    "triage_alert",
    "Send a SIEM alert to AgentNX. Returns a verdict (suppress / escalate / investigate), severity score, and reasoning. Integrates with Splunk, Sentinel, QRadar.",
    {
      alert_id: z.string().describe("SIEM alert or incident ID"),
      title: z.string().describe("Alert title or rule name"),
      description: z.string().describe("Full alert description, raw log, or event details"),
      source_ip: z.string().optional().describe("Source IP if applicable"),
      severity: z.enum(["Low", "Medium", "High", "Critical"]).optional(),
    },
    async ({ alert_id, title, description, source_ip, severity }) => {
      const verdict = await askClaude(
        `You are AgentNX, a federal IT security triage agent. Analyze security alerts and return a structured JSON verdict.
         Always respond with valid JSON only — no markdown, no explanation outside the JSON.
         Fields: verdict (suppress|escalate|investigate), severity_score (1-10), confidence (low|medium|high),
         reasoning (2-3 sentences), recommended_action (specific next step), false_positive_indicators (array of strings).`,
        `Alert ID: ${alert_id}
Title: ${title}
Description: ${description}
${source_ip ? `Source IP: ${source_ip}` : ""}
${severity ? `Reported Severity: ${severity}` : ""}

Triage this alert.`
      );

      let parsed: Record<string, unknown>;
      try { parsed = JSON.parse(verdict); } catch { parsed = { verdict: "investigate", reasoning: verdict }; }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            alert_id,
            ...parsed,
            actioned_by: "AgentNX",
            timestamp: new Date().toISOString(),
          }, null, 2),
        }],
      };
    }
  );

  // ── Tool 2: Handle helpdesk request ───────────────────────────────────────
  s.tool(
    "handle_helpdesk_request",
    "Submit a Tier 1 IT helpdesk request to AgentNX. Returns resolution steps, escalation decision, and suggested ticket routing.",
    {
      request_id: z.string().optional(),
      user: z.string().describe("User email or ID submitting the request"),
      issue: z.string().describe("Description of the IT issue"),
      system: z.string().optional().describe("Affected system (VPN, O365, PIV, etc.)"),
    },
    async ({ request_id, user, issue, system }) => {
      const resolution = await askClaude(
        `You are AgentNX, a VA Tier 1 IT helpdesk agent. Resolve common IT issues autonomously.
         Respond with valid JSON only.
         Fields: can_resolve_autonomously (boolean), resolution_steps (array of strings),
         escalate_to (null or team name: ICAM|Cybersecurity|Network|Desktop),
         estimated_resolution_time (string), suggested_queue (EUO|ICAM|SNO|Cybersecurity|TAC).`,
        `User: ${user}
Issue: ${issue}
${system ? `System: ${system}` : ""}

Resolve or route this helpdesk request.`
      );

      let parsed: Record<string, unknown>;
      try { parsed = JSON.parse(resolution); } catch { parsed = { can_resolve_autonomously: false, resolution_steps: [resolution] }; }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            request_id: request_id ?? "REQ" + Date.now(),
            user,
            issue,
            ...parsed,
            actioned_by: "AgentNX",
            timestamp: new Date().toISOString(),
          }, null, 2),
        }],
      };
    }
  );

  // ── Tool 3: Handle ICAM access request ────────────────────────────────────
  s.tool(
    "handle_access_request",
    "Submit an ICAM access request to AgentNX. Checks policy compliance, returns approval decision, and generates audit documentation.",
    {
      request_id: z.string().optional(),
      requestor: z.string().describe("User requesting access (email)"),
      system: z.string().describe("System or resource being requested"),
      role: z.string().describe("Role or permission level requested"),
      justification: z.string().describe("Business justification for the access"),
      manager: z.string().optional().describe("Manager approving the request"),
    },
    async ({ request_id, requestor, system, role, justification, manager }) => {
      const decision = await askClaude(
        `You are AgentNX, a federal ICAM (Identity, Credential, and Access Management) agent.
         Evaluate access requests against least-privilege and need-to-know principles.
         Respond with valid JSON only.
         Fields: decision (approve|deny|escalate_for_review), policy_check (passed|failed|needs_review),
         risk_level (low|medium|high), conditions (array of strings — any conditions on approval),
         audit_notes (string — what to log for compliance), deny_reason (null or string).`,
        `Requestor: ${requestor}
System: ${system}
Role: ${role}
Justification: ${justification}
${manager ? `Manager: ${manager}` : ""}

Evaluate this access request.`
      );

      let parsed: Record<string, unknown>;
      try { parsed = JSON.parse(decision); } catch { parsed = { decision: "escalate_for_review", audit_notes: decision }; }

      const reqId = request_id ?? "ICAM" + Date.now();
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            request_id: reqId,
            requestor, system, role, justification,
            ...parsed,
            change_ticket: (parsed as Record<string, unknown>).decision === "approve" ? "CHG" + Math.floor(Math.random() * 90000 + 10000) : null,
            actioned_by: "AgentNX",
            timestamp: new Date().toISOString(),
          }, null, 2),
        }],
      };
    }
  );

  // ── Tool 4: Generate incident report ──────────────────────────────────────
  s.tool(
    "generate_incident_report",
    "Feed AgentNX raw incident data — returns a structured, audit-ready incident report formatted for federal ITSM systems.",
    {
      incident_id: z.string(),
      summary: z.string().describe("Raw incident summary or notes"),
      timeline: z.string().optional().describe("Timeline of events if known"),
      affected_systems: z.string().optional(),
      severity: z.enum(["Low", "Medium", "High", "Critical"]).optional(),
    },
    async ({ incident_id, summary, timeline, affected_systems, severity }) => {
      const report = await askClaude(
        `You are AgentNX, a federal IT incident documentation agent. Generate structured, audit-ready incident reports.
         Respond with valid JSON only.
         Fields: executive_summary (2-3 sentences), root_cause_hypothesis (string),
         impact_assessment (string), containment_steps (array), remediation_steps (array),
         lessons_learned (array), nist_controls_affected (array of NIST SP 800-53 control IDs),
         classification (Unclassified|CUI|Confidential).`,
        `Incident ID: ${incident_id}
Summary: ${summary}
${timeline ? `Timeline: ${timeline}` : ""}
${affected_systems ? `Affected Systems: ${affected_systems}` : ""}
${severity ? `Severity: ${severity}` : ""}

Generate a complete incident report.`
      );

      let parsed: Record<string, unknown>;
      try { parsed = JSON.parse(report); } catch { parsed = { executive_summary: report }; }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            incident_id,
            severity: severity ?? "Medium",
            ...parsed,
            generated_by: "AgentNX",
            generated_at: new Date().toISOString(),
          }, null, 2),
        }],
      };
    }
  );

  // ── Tool 5: Route ticket ───────────────────────────────────────────────────
  s.tool(
    "route_ticket",
    "Submit a ticket to AgentNX for intelligent routing. Returns the correct VA OI&T team, priority, and SLA.",
    {
      ticket_id: z.string().optional(),
      title: z.string(),
      description: z.string(),
      submitter: z.string().optional(),
    },
    async ({ ticket_id, title, description, submitter }) => {
      const routing = await askClaude(
        `You are AgentNX, a VA IT ticket routing agent. Route tickets to the correct OI&T team.
         Available queues: EUO (end user), ICAM (identity/access), Cybersecurity, SNO (network), TAC (telecom), CTO (projects), Data.
         Respond with valid JSON only.
         Fields: queue (one of above), priority (Low|Medium|High|Critical),
         sla_hours (number), auto_resolvable (boolean),
         routing_reason (one sentence), keywords (array).`,
        `Title: ${title}
Description: ${description}
${submitter ? `Submitter: ${submitter}` : ""}

Route this ticket.`
      );

      let parsed: Record<string, unknown>;
      try { parsed = JSON.parse(routing); } catch { parsed = { queue: "EUO", priority: "Medium", routing_reason: routing }; }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            ticket_id: ticket_id ?? "INC" + Math.floor(Math.random() * 90000 + 10000),
            title,
            ...parsed,
            routed_by: "AgentNX",
            timestamp: new Date().toISOString(),
          }, null, 2),
        }],
      };
    }
  );

  return s;
}

// ── Auth check ───────────────────────────────────────────────────────────────
function unauthorized() {
  return new Response(
    JSON.stringify({ error: "Unauthorized — provide a valid AgentNX API key via Authorization: Bearer <key>" }),
    { status: 401, headers: { "Content-Type": "application/json" } }
  );
}

function checkAuth(req: NextRequest): boolean {
  const validKey = process.env.AGENTNX_MCP_API_KEY;
  if (!validKey) return true; // no key configured = open (dev mode)
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  return token === validKey;
}

// ── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  const server = buildAgentNXServer();
  await server.connect(transport);
  return transport.handleRequest(req);
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  const server = buildAgentNXServer();
  await server.connect(transport);
  return transport.handleRequest(req);
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  const server = buildAgentNXServer();
  await server.connect(transport);
  return transport.handleRequest(req);
}
