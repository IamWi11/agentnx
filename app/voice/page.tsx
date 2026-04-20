"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import VapiCallButton from "../components/VapiCallButton";

const AGENTNX_ASSISTANT_ID    = "b14094a0-22a6-46e2-8aa0-b00435d85dd0";
const PHARMA_ASSISTANT_ID     = "09fa7183-ff74-4974-94d0-849a165785e3";
const GOV_ASSISTANT_ID        = "ecdde4c4-db22-44af-b665-4c435b6b4c65";
const HEALTHCARE_ASSISTANT_ID = "e360cdf7-2323-46a8-890c-b04d1306eb44";

const AGENTS = [
  {
    id: "agentnx",
    assistantId: AGENTNX_ASSISTANT_ID,
    label: "Sales Agent",
    vertical: "AgentNX",
    icon: "🤖",
    tagline: "Ask anything about AgentNX.ai",
    description: "Talk directly to the AgentNX sales AI — ask about pricing, capabilities, or how to automate your operations. This is the live agent available to all visitors.",
    accent: { border: "border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/[0.04]", badge: "bg-blue-500/10 border-blue-500/30 text-blue-300", dot: "bg-blue-400" },
  },
  {
    id: "pharma",
    assistantId: PHARMA_ASSISTANT_ID,
    label: "GxP Compliance Agent",
    vertical: "Pharma",
    icon: "⚗️",
    tagline: "Deviation reporting · Veeva · 21 CFR Part 11",
    description: "Ask about deviation reporting, Veeva Vault workflows, CAPA management, or 21 CFR Part 11 — just like a real GxP operations assistant in a regulated facility.",
    accent: { border: "border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/[0.04]", badge: "bg-purple-500/10 border-purple-500/30 text-purple-300", dot: "bg-purple-400" },
  },
  {
    id: "government",
    assistantId: GOV_ASSISTANT_ID,
    label: "Federal IT Helpdesk",
    vertical: "Government",
    icon: "🏛️",
    tagline: "ICAM · Access management · Incident triage",
    description: "Request system access, report a suspicious login, or trigger an account deprovisioning — just like a real VA IT helpdesk agent handling ICAM workflows.",
    accent: { border: "border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/[0.04]", badge: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300", dot: "bg-emerald-400" },
  },
  {
    id: "healthcare",
    assistantId: HEALTHCARE_ASSISTANT_ID,
    label: "Scheduling Desk",
    vertical: "Healthcare",
    icon: "🏥",
    tagline: "Appointments · Triage · Insurance",
    description: "Schedule, reschedule, or cancel appointments, handle urgent vs. routine triage, and manage insurance questions — like a live clinic scheduling desk.",
    accent: { border: "border-cyan-500/30 hover:border-cyan-500/60 hover:bg-cyan-500/[0.04]", badge: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300", dot: "bg-cyan-400" },
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

export default function VoicePage() {
  return (
    <main className="min-h-screen bg-[#080c18] text-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5 sticky top-0 z-50 backdrop-blur-md bg-[#080c18]/80">
        <a href="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          Agent<span className="text-blue-400">NX</span>
          <span className="text-blue-400">.ai</span>
        </a>
        <div className="flex items-center gap-5">
          <Link href="/pricing" className="text-gray-400 hover:text-white text-sm transition">Pricing</Link>
          <Link href="/mcp-demo" className="text-gray-400 hover:text-white text-sm transition">MCP Demo</Link>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All agents live
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-14 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-4"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Live Voice Agent Demos
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl leading-tight">
            Talk to a real AI agent.<br />
            <span className="text-blue-400">Right now, in your browser.</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-gray-400 max-w-lg leading-relaxed">
            Four live agents, four verticals. Click any card, speak naturally — no phone, no app, no form.
          </motion.p>
        </motion.div>
      </div>

      {/* Agent cards */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-6">
          {AGENTS.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              custom={i}
              className={`flex flex-col gap-6 rounded-2xl border bg-white/[0.03] p-8 transition-all ${agent.accent.border}`}
            >
              {/* Card header */}
              <div className="flex items-start gap-4">
                <div className="text-4xl">{agent.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-widest border px-2 py-0.5 rounded-full ${agent.accent.badge}`}>
                      {agent.vertical}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-500">
                      <span className={`w-1.5 h-1.5 rounded-full ${agent.accent.dot}`} />
                      Live
                    </span>
                  </div>
                  <div className="font-bold text-white text-lg leading-snug">{agent.label}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{agent.tagline}</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed flex-1">{agent.description}</p>

              {/* Call button */}
              <VapiCallButton
                assistantId={agent.assistantId}
                label={`Call ${agent.vertical} Agent`}
                size="md"
              />
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-10"
        >
          <motion.h2 variants={fadeUp} className="text-xl font-bold text-center mb-10">How these demos work</motion.h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { n: "01", title: "Click to call", desc: "Your browser connects directly to the AI agent over WebRTC — no app, no phone number." },
              { n: "02", title: "Speak naturally", desc: "The agent listens in real time, understands context, and responds with a natural voice." },
              { n: "03", title: "Production-ready", desc: "In deployment, the agent connects to your systems — Veeva Vault, Salesforce, SAM.gov, and more." },
            ].map((item, i) => (
              <motion.div key={item.n} variants={fadeUp} custom={i}>
                <div className="w-10 h-10 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 font-bold flex items-center justify-center mx-auto mb-4 text-sm">
                  {item.n}
                </div>
                <div className="font-semibold mb-2">{item.title}</div>
                <div className="text-gray-500 text-sm leading-relaxed">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mt-10 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 p-10 text-center"
        >
          <motion.h3 variants={fadeUp} className="text-2xl font-extrabold mb-2">Want an agent built for your workflows?</motion.h3>
          <motion.p variants={fadeUp} custom={1} className="text-gray-400 mb-8 max-w-lg mx-auto text-sm leading-relaxed">
            AgentNX builds production-ready voice agents tailored to your environment — pharma, government, healthcare, or enterprise sales. Live in 48 hours.
          </motion.p>
          <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:william@agentnx.ai?subject=Custom Voice Agent"
              className="px-8 py-3 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm transition-all"
            >
              Talk to us →
            </a>
            <Link href="/pricing" className="px-8 py-3 rounded-full border border-white/20 text-gray-300 hover:text-white hover:border-white/40 font-semibold text-sm transition-all">
              View pricing
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 px-8 py-8 text-center text-gray-700 text-xs">
        © 2026 AgentNX.ai · IMAGE 101 LLC · Service-Disabled Veteran-Owned Small Business
        <span className="mx-3">·</span>
        <Link href="/pricing" className="hover:text-gray-400 transition">Pricing</Link>
        <span className="mx-3">·</span>
        <Link href="/mcp-demo" className="hover:text-gray-400 transition">MCP Demo</Link>
      </footer>
    </main>
  );
}
