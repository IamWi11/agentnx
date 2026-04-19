"use client";

import VapiCallButton from "../components/VapiCallButton";

const AGENTNX_ASSISTANT_ID  = "b14094a0-22a6-46e2-8aa0-b00435d85dd0";
const PHARMA_ASSISTANT_ID   = "09fa7183-ff74-4974-94d0-849a165785e3";
const GOV_ASSISTANT_ID      = "ecdde4c4-db22-44af-b665-4c435b6b4c65";

const AGENTS = [
  {
    id: "agentnx",
    label: "AgentNX Sales Agent",
    icon: "🤖",
    tagline: "Ask anything about AgentNX.ai",
    description:
      "Talk directly to the AgentNX AI — ask about pricing, capabilities, use cases, or how we can automate your operations. This is the live agent available to all visitors on our site.",
    color: "blue",
  },
  {
    id: "pharma",
    label: "Pharma/GxP Agent",
    icon: "🔬",
    tagline: "GxP deviation & compliance assistant",
    description:
      "A demo of the AgentNX pharma compliance agent. Ask it about deviation reporting, Veeva Vault workflows, CAPA management, or 21 CFR Part 11 — just like a real GxP operations assistant.",
    color: "purple",
  },
  {
    id: "government",
    label: "Government/Federal Agent",
    icon: "🏛️",
    tagline: "Federal operations & compliance assistant",
    description:
      "A demo of the AgentNX federal IT agent. Request system access, report a suspicious login, or trigger an account deprovisioning — just like a real VA IT helpdesk agent handling ICAM workflows.",
    color: "green",
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
                  assistantId={
                    agent.id === "agentnx"     ? AGENTNX_ASSISTANT_ID :
                    agent.id === "pharma"      ? PHARMA_ASSISTANT_ID  :
                    agent.id === "government"  ? GOV_ASSISTANT_ID     :
                    undefined
                  }
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
