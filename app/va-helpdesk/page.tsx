"use client";

import { useState } from "react";

type Classification = {
  priority: "P1" | "P2" | "P3" | "P4";
  category: string;
  routeTo: string;
  reasoning: string;
  suggestedResponse: string;
  autoResolvable: boolean;
  escalationReason: string;
  confidence: number;
};

type Ticket = {
  id: string;
  facility: string;
  reporter: string;
  submitted: string;
  title: string;
  body: string;
};

const TICKETS: Ticket[] = [
  {
    id: "INC-00847623",
    facility: "Bronx VAMC",
    reporter: "Dr. M. (Staff Physician, Cardiology)",
    submitted: "08:14 ET",
    title: "CPRS login — Access Denied on clinical workstation",
    body: "I cannot log into CPRS on workstation CARD-14 this morning. I rebooted, tried my PIV and PIN, and got 'Access Denied – contact admin.' I have three patients waiting for chart review before rounds at 09:00. This is urgent — I need CPRS access now.",
  },
  {
    id: "INC-00847711",
    facility: "Atlanta VAMC",
    reporter: "K. Whitfield (Social Worker)",
    submitted: "09:02 ET",
    title: "PIV card not recognized after Windows update",
    body: "My PIV card stopped working after last night's Windows update. The reader light is on but the machine says 'No Certificate Found.' I tried both my primary and backup card. I can still sign in with username + password but I can't access SharePoint or MS Teams without PIV.",
  },
  {
    id: "INC-00847842",
    facility: "Philadelphia VAMC",
    reporter: "J. Rivera (RN, Onboarding)",
    submitted: "09:47 ET",
    title: "Access request — BCMA for new nurse",
    body: "I started Monday as an RN on 3-West. I need access to BCMA (Bar Code Med Administration) for my unit. My supervisor (N. Patel) already approved. Can you set up my role and add me to the 3-West med-admin group? No urgency — I'm shadowing until Friday.",
  },
  {
    id: "INC-00847891",
    facility: "Houston VAMC",
    reporter: "Reception (Bldg 4, Desk 2)",
    submitted: "10:12 ET",
    title: "Printer jammed — front desk printer",
    body: "The HP printer at the front desk in Building 4 is showing 'Paper Jam – Tray 2' and won't clear after we pulled the visible jam. Multiple patients are waiting for printed check-in slips. Is there a facility IT tech nearby who can come look?",
  },
];

function priorityColor(p: string) {
  if (p === "P1") return "text-red-400 border-red-500/50 bg-red-500/10";
  if (p === "P2") return "text-orange-400 border-orange-500/50 bg-orange-500/10";
  if (p === "P3") return "text-yellow-400 border-yellow-500/50 bg-yellow-500/10";
  return "text-blue-400 border-blue-500/50 bg-blue-500/10";
}

export default function VAHelpdeskDemo() {
  const [active, setActive] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [classification, setClassification] = useState<Classification | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function classify(t: Ticket) {
    setActive(t);
    setLoading(true);
    setClassification(null);
    setElapsedMs(null);
    setError(null);
    const started = performance.now();
    try {
      const res = await fetch("/api/va-helpdesk-classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticket: `Ticket ID: ${t.id}\nFacility: ${t.facility}\nReporter: ${t.reporter}\nTitle: ${t.title}\n\n${t.body}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Classification failed");
      } else {
        setClassification(data.classification);
        setElapsedMs(Math.round(performance.now() - started));
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setActive(null);
    setClassification(null);
    setElapsedMs(null);
    setError(null);
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <a href="/" className="text-blue-400 text-sm mb-4 inline-block">← Back to AgentNX</a>
          <h1 className="text-4xl font-extrabold mb-2">
            IT Helpdesk <span className="text-blue-400">Triage Agent</span>
          </h1>
          <p className="text-gray-400 max-w-3xl">
            Live demo: AI agent classifies inbound IT tickets, assigns priority, routes to the right team, and drafts a reply.
            Every classification is a real inference call to Claude — no canned responses.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-yellow-300/80 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1">
            <span>●</span>
            <span>Demonstration only · synthetic tickets · not connected to any real VA system · no PII</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left — ticket queue */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Inbound Queue</h2>
              <span className="text-xs text-gray-500">{TICKETS.length} open</span>
            </div>
            <div className="space-y-3">
              {TICKETS.map(t => (
                <button
                  key={t.id}
                  onClick={() => classify(t)}
                  disabled={loading}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    active?.id === t.id
                      ? "bg-blue-500/10 border-blue-500/60"
                      : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-gray-500">{t.id}</span>
                    <span className="text-xs text-gray-500">{t.submitted}</span>
                  </div>
                  <div className="text-sm font-semibold mb-1">{t.title}</div>
                  <div className="text-xs text-gray-400 mb-2">
                    {t.facility} · {t.reporter}
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-2">{t.body}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-4">
              Click any ticket to run the agent. Classification is a live call to Claude (Opus 4.7) — expect 2–6 seconds.
            </p>
          </div>

          {/* Right — agent output */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Agent Output</h2>
              {elapsedMs !== null && (
                <span className="text-xs text-green-400 font-mono">{elapsedMs} ms</span>
              )}
            </div>

            {!active && (
              <div className="rounded-xl border border-dashed border-white/10 p-10 text-center text-gray-500 text-sm">
                Select a ticket on the left to see the agent classify, route, and draft a response.
              </div>
            )}

            {active && loading && (
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-sm text-blue-300">Agent analyzing {active.id}…</span>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-white/10 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-white/10 rounded animate-pulse w-1/2" />
                  <div className="h-3 bg-white/10 rounded animate-pulse w-5/6" />
                </div>
              </div>
            )}

            {active && error && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-sm">
                <div className="font-semibold text-red-300 mb-2">Classification failed</div>
                <div className="text-red-200/80">{error}</div>
                <button
                  onClick={() => classify(active)}
                  className="mt-4 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-semibold px-4 py-2 rounded-lg"
                >
                  Retry
                </button>
              </div>
            )}

            {active && classification && !loading && (
              <div className="space-y-4">
                {/* Priority + Category */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-xl border p-4 ${priorityColor(classification.priority)}`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">Priority</div>
                    <div className="text-2xl font-extrabold">{classification.priority}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Category</div>
                    <div className="text-sm font-semibold">{classification.category}</div>
                  </div>
                </div>

                {/* Routing */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Routed To</div>
                  <div className="text-base font-semibold text-blue-300">{classification.routeTo}</div>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className={classification.autoResolvable ? "text-green-400" : "text-orange-400"}>
                      {classification.autoResolvable ? "✓ Auto-resolvable at Tier 1" : "→ Human escalation required"}
                    </span>
                    <span className="text-gray-500">Confidence: {classification.confidence}%</span>
                  </div>
                  {!classification.autoResolvable && classification.escalationReason && (
                    <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-white/5">
                      <span className="text-gray-500">Escalation reason:</span> {classification.escalationReason}
                    </div>
                  )}
                </div>

                {/* Reasoning */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Agent Reasoning</div>
                  <div className="text-sm text-gray-300 leading-relaxed">{classification.reasoning}</div>
                </div>

                {/* Suggested response */}
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-300 mb-2">Drafted Response to Reporter</div>
                  <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{classification.suggestedResponse}</div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                    <button className="bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                      Send
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                      Edit
                    </button>
                    <button
                      onClick={reset}
                      className="bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-semibold px-3 py-1.5 rounded-lg ml-auto"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-white/5 grid md:grid-cols-3 gap-6 text-xs text-gray-500">
          <div>
            <div className="font-bold uppercase tracking-wider text-gray-400 mb-2">Architecture</div>
            Next.js App Router → Anthropic Claude Opus 4.7 → structured JSON output. Audit log + rate limiting enforced server-side.
          </div>
          <div>
            <div className="font-bold uppercase tracking-wider text-gray-400 mb-2">Security posture</div>
            Prompt-injection defense, CSRF origin check, IP rate-limit, no PII in logs, no real VA data ever ingested.
          </div>
          <div>
            <div className="font-bold uppercase tracking-wider text-gray-400 mb-2">In production this would</div>
            Integrate with ServiceNow / Remedy, pull identity from Okta/ICAM, write to CDW, respect FedRAMP boundary.
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-12">
          AgentNX.ai · IMAGE 101 LLC · SDVOSB (SBA verification pending) · SAM UEI WW9HD15FW7E7
        </p>
        <p className="text-center text-gray-700 text-xs mt-2">
          This demo is not affiliated with the U.S. Department of Veterans Affairs. VA, VHA, and VBA marks remain the property of their respective owners.
        </p>
      </div>
    </main>
  );
}
