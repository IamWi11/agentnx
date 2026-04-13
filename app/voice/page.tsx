"use client";

import VapiCallButton from "../components/VapiCallButton";

const AGENTNX_ASSISTANT_ID = "b14094a0-22a6-46e2-8aa0-b00435d85dd0";

const AGENTS = [
  {
    id: "agentnx",
    label: "AgentNX Sales Agent",
    icon: "🤖",
    tagline: "Ask anything about AgentNX.ai",
    description:
      "Talk directly to the AgentNX AI — ask about pricing, capabilities, use cases, or how we can automate your operations. This is the live agent available to all visitors on our site.",
    color: "blue",
    firstMessage:
      "Hi! I'm the AgentNX AI assistant. I can tell you about our AI agent platform, walk you through our capabilities, and help you figure out if AgentNX is the right fit for your organization. What can I help you with today?",
    systemPrompt: `You are the AgentNX AI sales assistant, representing AgentNX.ai — an AI agent platform built by IMAGE 101 LLC, a Service-Disabled Veteran-Owned Small Business (SDVOSB) based in Watchung, NJ.

AgentNX builds intelligent agents that automate workflows for:
- Pharma/Biotech: GxP deviation management, Veeva Vault document routing, 21 CFR Part 11 compliance
- Government/Federal: SAM.gov registered, SDVOSB set-aside eligible, federal compliance workflows
- Cybersecurity: incident triage, alert routing, remediation tracking
- Healthcare: clinical documentation, HIPAA-aware workflow automation

Key differentiators:
- SDVOSB certified (set-aside eligible for federal contracts)
- Production AI agents, not just consulting
- Deep pharma/biotech and government domain experience
- Built on modern AI stack (Next.js, Groq, OpenAI, Vercel)

Be helpful, concise, and professional. If asked about pricing, say it depends on the use case and offer to connect them with William Munoz for a custom quote. Encourage booking a demo at agentnx.ai.`,
  },
  {
    id: "pharma",
    label: "Pharma/GxP Agent",
    icon: "🔬",
    tagline: "GxP deviation & compliance assistant",
    description:
      "A demo of the AgentNX pharma compliance agent. Ask it about deviation reporting, Veeva Vault workflows, CAPA management, or 21 CFR Part 11 — just like a real GxP operations assistant.",
    color: "purple",
    firstMessage:
      "Hello! I'm the AgentNX GxP compliance assistant. I can help with deviation reporting, document routing, CAPA tracking, and regulatory workflow questions. How can I assist you today?",
    systemPrompt: `You are an AI agent for GxP pharmaceutical operations, built on the AgentNX platform.

You assist with:
- Deviation and incident reporting (initial report, investigation, CAPA)
- Veeva Vault document lifecycle management (routing, approvals, status checks)
- 21 CFR Part 11 electronic records and signatures compliance
- Batch record review workflows
- Change control and deviation classification (critical, major, minor)
- SOP compliance and training documentation

Speak like a knowledgeable pharma/biotech operations expert. Use terms like CAPA, OOS, deviation, batch record, validation, GMP, GxP, audit trail naturally. Be precise and compliance-focused.

If asked about specific documents, generate realistic mock examples. Always note that in production, AgentNX connects directly to the customer's Veeva Vault or LIMS system.`,
  },
  {
    id: "government",
    label: "Government/Federal Agent",
    icon: "🏛️",
    tagline: "Federal operations & compliance assistant",
    description:
      "A demo of the AgentNX federal agent. Ask it about SDVOSB set-asides, SAM.gov registration, NIST compliance workflows, or federal contract documentation.",
    color: "green",
    firstMessage:
      "Hello! I'm the AgentNX federal operations assistant. I can help with compliance workflows, SDVOSB contracting, SAM.gov questions, and government documentation automation. How can I help you today?",
    systemPrompt: `You are an AI agent for federal government operations and contracting, built on the AgentNX platform by IMAGE 101 LLC — a verified Service-Disabled Veteran-Owned Small Business (SDVOSB).

You assist with:
- SDVOSB set-aside contracting and eligibility questions
- SAM.gov registration, UEI lookup, CAGE codes
- SBA 8(a) program information
- NIST SP 800-53 and NIST SP 800-161 compliance frameworks
- System Security Plans (SSP), POA&M, ATO documentation
- Federal acquisition regulations (FAR/DFARS)
- VA Pathfinder, VA T4NG, CIO-SP3 vehicle questions
- Government workflow automation and documentation routing

Speak like a knowledgeable government contracting and federal IT compliance expert. Use acronyms naturally (ATO, RMF, FISMA, STIG, CMMC, FedRAMP). Be precise and professional.

IMAGE 101 LLC details:
- SDVOSB certified
- SAM.gov registered (CAGE code pending, UEI: pending April 2026 activation)
- Based in Watchung, NJ
- Founder: William Munoz, U.S. Army veteran`,
  },
];

const COLOR_STYLES: Record<string, { border: string; badge: string; icon: string }> = {
  blue: {
    border: "border-blue-500/30 hover:border-blue-500/60",
    badge: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    icon: "bg-blue-500/10",
  },
  purple: {
    border: "border-purple-500/30 hover:border-purple-500/60",
    badge: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    icon: "bg-purple-500/10",
  },
  green: {
    border: "border-green-500/30 hover:border-green-500/60",
    badge: "bg-green-500/10 border-green-500/30 text-green-400",
    icon: "bg-green-500/10",
  },
};

export default function VoicePage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <a href="/" className="text-xl font-bold tracking-tight">
          Agent<span className="text-blue-400">NX</span>
          <span className="text-blue-400">.ai</span>
        </a>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">Voice Agents</span>
          <span className="bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold px-3 py-1 rounded-full">
            ● Live
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            AgentNX Voice Agents
          </div>
          <h1 className="text-4xl font-extrabold mb-3">
            Talk to an <span className="text-blue-400">AI Agent</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Each agent below is live and ready to talk. Pick the one that matches your use case — click the button and start speaking directly in your browser. No phone needed.
          </p>
        </div>

        {/* Agent Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {AGENTS.map((agent) => {
            const styles = COLOR_STYLES[agent.color];
            return (
              <div
                key={agent.id}
                className={`bg-white/5 border ${styles.border} rounded-2xl p-6 flex flex-col gap-5 transition`}
              >
                <div className="flex items-start gap-3">
                  <div className={`${styles.icon} rounded-xl p-3 text-2xl`}>
                    {agent.icon}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{agent.label}</div>
                    <div className={`text-xs mt-0.5 border rounded-full px-2 py-0.5 inline-block ${styles.badge}`}>
                      {agent.tagline}
                    </div>
                  </div>
                </div>

                <p className="text-gray-400 text-xs leading-relaxed flex-1">
                  {agent.description}
                </p>

                <VapiCallButton
                  assistantId={agent.id === "agentnx" ? AGENTNX_ASSISTANT_ID : undefined}
                  assistantConfig={agent.id !== "agentnx" ? {
                    systemPrompt: agent.systemPrompt,
                    firstMessage: agent.firstMessage,
                  } : undefined}
                  label={`Call ${agent.label.split(" ")[0]} Agent`}
                  size="sm"
                />
              </div>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { step: "1", title: "Click to Call", desc: "Hit the button — your browser connects directly to the AI agent over WebRTC. No app or phone needed." },
              { step: "2", title: "Talk Naturally", desc: "Speak out loud. The agent listens, understands, and responds in real-time with a natural voice." },
              { step: "3", title: "Deploy to Your Ops", desc: "In production, the agent connects to your systems — Veeva Vault, Salesforce, SAM.gov, LIMS, and more." },
            ].map((item) => (
              <div key={item.step}>
                <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <div className="font-semibold mb-1">{item.title}</div>
                <div className="text-gray-400 text-xs leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Want a Custom Voice Agent?</h3>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto text-sm">
            AgentNX builds production-ready voice agents tailored to your workflows — pharma, government, healthcare, or enterprise. Deployed in days, not months.
          </p>
          <a
            href="/#book-demo"
            className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3 rounded-full text-sm transition"
          >
            Book a Demo
          </a>
        </div>
      </div>

      <footer className="border-t border-white/10 px-8 py-6 text-center text-gray-600 text-sm mt-4">
        © 2026 AgentNX.ai — AI Agents for Enterprise & Government Operations
        <span className="mx-3">·</span>
        <span>A product of IMAGE 101 LLC · Service-Disabled Veteran-Owned Small Business</span>
      </footer>
    </main>
  );
}
