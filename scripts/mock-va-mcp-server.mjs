#!/usr/bin/env node
/**
 * Mock VA IT MCP Server — per-request stateless mode
 * Run: node scripts/mock-va-mcp-server.mjs
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "node:http";
import { z } from "zod";

function buildServer() {
  const s = new McpServer({ name: "va-it-mock", version: "1.0.0" });

  s.tool("get_open_tickets",
    "Fetch open IT incidents from VA ServiceNow. Filter by priority.",
    { priority: z.enum(["Low","Medium","High","Critical"]).optional() },
    async ({ priority }) => {
      const all = [
        { id:"INC0042", title:"VPN access issue — user locked out",              priority:"Medium", queue:"EUO" },
        { id:"INC0043", title:"Password reset — PIV card not recognized",         priority:"Low",    queue:"ICAM" },
        { id:"INC0044", title:"Splunk alert — suspicious login 185.234.x.x",     priority:"High",   queue:"Cybersecurity" },
        { id:"INC0045", title:"ServiceNow access request — new contractor",       priority:"Medium", queue:"ICAM" },
        { id:"INC0046", title:"Network outage — Building 7 switch down",          priority:"Critical", queue:"SNO" },
      ];
      const result = priority ? all.filter(t => t.priority === priority) : all;
      return { content: [{ type:"text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  s.tool("triage_alert",
    "Triage a SIEM alert — suppress false positive, escalate, or flag for investigation.",
    { alert_id: z.string(), verdict: z.enum(["suppress","escalate","investigate"]), reason: z.string() },
    async ({ alert_id, verdict, reason }) => ({
      content: [{ type:"text", text: JSON.stringify({
        alert_id, verdict, reason,
        actioned_by: "AgentNX",
        timestamp: new Date().toISOString(),
        siem_status: verdict==="suppress" ? "Closed — False Positive"
                   : verdict==="escalate" ? "Assigned to SOC L2"
                   : "Under Investigation",
        ticket_created: verdict!=="suppress" ? "INC"+Math.floor(Math.random()*90000+10000) : null,
      }, null, 2) }]
    })
  );

  s.tool("get_user_access",
    "Look up what VA systems a user currently has access to (ICAM / Active Directory).",
    { username: z.string() },
    async ({ username }) => ({
      content: [{ type:"text", text: JSON.stringify({
        username,
        systems: ["VA O365","VPN (Cisco AnyConnect)","ServiceNow (read-only)","VistA (view-only)"],
        clearance: "Public Trust — Tier 1",
        mfa_enrolled: true,
        last_login: "2026-04-18T09:23:00Z",
        account_status: "Active",
      }, null, 2) }]
    })
  );

  s.tool("provision_access",
    "Provision system access for a VA user after policy check. Logs to ServiceNow.",
    { username: z.string(), system: z.string(), role: z.string(), justification: z.string() },
    async ({ username, system, role, justification }) => {
      const changeId = "CHG"+Math.floor(Math.random()*90000+10000);
      return { content: [{ type:"text", text: JSON.stringify({
        status: "provisioned", change_id: changeId,
        username, system, role, justification,
        policy_check: "PASSED — role within entitlement policy",
        approved_by: "AgentNX (auto-approved: policy compliant)",
        provisioned_at: new Date().toISOString(),
        audit_trail: `Written to ServiceNow ${changeId} and AD audit log`,
      }, null, 2) }] };
    }
  );

  s.tool("create_ticket",
    "Create a ServiceNow incident or change request in the VA ITSM system.",
    {
      title: z.string(),
      priority: z.enum(["Low","Medium","High","Critical"]),
      description: z.string(),
      queue: z.enum(["EUO","ICAM","Cybersecurity","SNO","TAC","CTO"]).optional(),
    },
    async ({ title, priority, description, queue }) => {
      const id = "INC"+Math.floor(Math.random()*90000+10000);
      return { content: [{ type:"text", text: JSON.stringify({
        id, title, priority, description,
        queue: queue ?? "auto-routed",
        created_by: "AgentNX",
        created_at: new Date().toISOString(),
        status: "Open",
        sla_target: priority==="Critical"?"1 hour":priority==="High"?"4 hours":"24 hours",
      }, null, 2) }] };
    }
  );

  return s;
}

const httpServer = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, mcp-session-id");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");

  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }
  if (req.url !== "/mcp") { res.writeHead(404); res.end("endpoint is /mcp"); return; }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks).toString();

  try {
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    const mcpServer = buildServer();
    await mcpServer.connect(transport);
    await transport.handleRequest(req, res, rawBody ? JSON.parse(rawBody) : undefined);
  } catch (err) {
    console.error("[mcp-server error]", err.message);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
  }
});

httpServer.listen(3333, () => {
  console.log("\n✅  VA Mock MCP Server → http://localhost:3333/mcp\n");
  console.log("Tools: get_open_tickets · triage_alert · get_user_access · provision_access · create_ticket\n");
  console.log("── Test commands (Next.js on :3001) ────────────────────────────────");
  console.log('\nDiscover tools:');
  console.log('  curl "http://localhost:3001/api/mcp-agent?serverUrl=http://localhost:3333/mcp" | jq .\n');
  console.log('Demo 1 — Triage suspicious login:');
  console.log(`  curl -s -X POST http://localhost:3001/api/mcp-agent \\`);
  console.log(`    -H "Content-Type: application/json" \\`);
  console.log(`    -d '{"serverUrl":"http://localhost:3333/mcp","message":"Check open high-priority tickets. Find the suspicious login alert and escalate it — create a ticket in the Cybersecurity queue."}' | jq .\n`);
  console.log('Demo 2 — ICAM access request:');
  console.log(`  curl -s -X POST http://localhost:3001/api/mcp-agent \\`);
  console.log(`    -H "Content-Type: application/json" \\`);
  console.log(`    -d '{"serverUrl":"http://localhost:3333/mcp","message":"John Smith (smith.john@va.gov) needs Splunk read access for the SOC project. Check his current access, provision it, and create an audit ticket."}' | jq .`);
  console.log("\n────────────────────────────────────────────────────────────────────\n");
});
