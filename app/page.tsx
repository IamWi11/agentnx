"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import VapiCallButton from "./components/VapiCallButton";

const AGENTNX_ASSISTANT_ID = "b14094a0-22a6-46e2-8aa0-b00435d85dd0";

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: ((i * 47 + 11) % 88) + 6,
  y: ((i * 31 + 7) % 75) + 8,
  size: (i % 3) === 0 ? 2.5 : (i % 3) === 1 ? 1.5 : 2,
  duration: 5 + (i % 6),
  delay: (i * 0.35) % 4,
  opacity: (i % 4) === 0 ? 0.55 : 0.25,
}));

const STATS = [
  { stat: "< 1s",  label: "Response time" },
  { stat: "24/7",  label: "Always on" },
  { stat: "3",     label: "Live verticals" },
  { stat: "0",     label: "Hold time" },
];

const TECH_PARTNERS = [
  { name: "VAPI",       sub: "Voice AI" },
  { name: "Anthropic",  sub: "Claude LLM" },
  { name: "Deepgram",   sub: "Transcription" },
  { name: "Daily.co",   sub: "WebRTC" },
  { name: "Stripe",     sub: "Payments" },
  { name: "Vercel",     sub: "Infrastructure" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Deploy in 48 hours",
    desc: "AgentNX configures your agent against your workflows, scripts, and escalation rules — no engineering team required.",
  },
  {
    step: "02",
    title: "Agent handles every call",
    desc: "Callers reach a live AI voice agent instantly. It qualifies, answers, documents, and routes — at any volume.",
  },
  {
    step: "03",
    title: "Escalate when it matters",
    desc: "Complex or urgent requests are handed to a human in real time. Everything else is resolved automatically.",
  },
];

const VERTICALS = [
  {
    icon: "⚗️",
    label: "Pharma & GxP",
    headline: "Compliance-ready voice agents for regulated environments",
    bullets: ["Deviation reporting", "Veeva Vault workflows", "21 CFR Part 11 audit trails", "CAPA routing"],
    cta: "Try Pharma Agent",
    href: "/voice",
  },
  {
    icon: "🏛️",
    label: "Federal & Government",
    headline: "ICAM-aware agents for government IT helpdesks",
    bullets: ["Access provisioning", "Incident triage & escalation", "Identity lifecycle management", "FISMA-aligned routing"],
    cta: "Try Gov Agent",
    href: "/voice",
  },
  {
    icon: "📞",
    label: "Sales & Operations",
    headline: "Inbound lead qualification at unlimited scale",
    bullets: ["Qualify & score inbound calls", "Send payment links via voice", "Route hot leads instantly", "24/7 coverage, zero wait"],
    cta: "Try Sales Agent",
    href: "/voice",
  },
];

const COMPLIANCE = [
  { label: "SDVOSB",          desc: "Veteran-Owned" },
  { label: "HIPAA Ready",     desc: "Healthcare" },
  { label: "FISMA Aligned",   desc: "Federal" },
  { label: "SOC 2 (Coming)",  desc: "Enterprise" },
  { label: "SAM.gov Active",  desc: "Gov Contracts" },
];

function TypewriterText({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    if (!deleting && displayed.length < word.length) {
      const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 60);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === word.length) {
      const t = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    }
  }, [displayed, deleting, index, words]);

  return (
    <span className="text-blue-400">
      {displayed}
      <span className="animate-pulse opacity-60">|</span>
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.12 } }),
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080c18] text-white overflow-x-hidden">

      {/* ── Nav ── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-8 py-5 border-b border-white/5 sticky top-0 z-50 backdrop-blur-md bg-[#080c18]/80"
      >
        <a href="/" className="group relative text-xl font-bold tracking-tight transition-opacity">
          Agent<span className="text-blue-400">NX</span>
          <span className="text-blue-400">.ai</span>
          <span className="absolute -bottom-5 left-0 text-[9px] font-normal text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-widest uppercase">
            NX = Next Generation
          </span>
        </a>
        <div className="flex items-center gap-6">
          <Link href="/voice" className="text-gray-400 hover:text-white text-sm transition">Solutions</Link>
          <Link href="/voice" className="text-gray-400 hover:text-white text-sm transition">Demos</Link>
          <Link href="/pricing" className="text-gray-400 hover:text-white text-sm transition">Pricing</Link>
          <Link href="/mcp-demo" className="text-gray-400 hover:text-white text-sm transition">MCP</Link>
          <VapiCallButton assistantId={AGENTNX_ASSISTANT_ID} label="Talk to AgentNX" size="sm" />
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 overflow-hidden">

        {/* Background glow */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25], x: [0, 30, -20, 0], y: [0, -20, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.25, 0.1], x: [0, -40, 20, 0], y: [0, 20, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none"
        />

        {/* Particles */}
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-blue-400 pointer-events-none"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
            animate={{ y: [0, -20, 0], opacity: [p.opacity, p.opacity * 2.2, p.opacity] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold tracking-wide"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Next-Generation AI Voice Agents · Pharma · Federal · Sales
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight max-w-4xl mb-6 relative z-10 tracking-tight"
        >
          Your business handles{" "}
          <TypewriterText words={["1,000 calls a day.", "every support ticket.", "every request.", "it all — automatically."]} />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg text-gray-400 max-w-xl mb-10 relative z-10 leading-relaxed"
        >
          AgentNX deploys AI voice agents that answer calls, qualify leads, and resolve requests — purpose-built for pharma, federal agencies, and enterprise sales ops.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 relative z-10 mb-3"
        >
          <VapiCallButton assistantId={AGENTNX_ASSISTANT_ID} label="Talk to AgentNX — it's free" size="lg" />
          <Link
            href="/voice"
            className="px-6 py-3.5 rounded-full border border-white/20 text-gray-300 hover:text-white hover:border-white/40 text-base font-semibold transition-all"
          >
            See live demos →
          </Link>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 text-xs relative z-10"
        >
          No signup. No credit card. Talk to the agent in 10 seconds.
        </motion.p>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="relative z-10 mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8"
        >
          {STATS.map(({ stat, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-extrabold text-blue-400 mb-1">{stat}</div>
              <div className="text-gray-500 text-xs uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Tech partner strip ── */}
      <section className="border-y border-white/5 py-8 px-6">
        <p className="text-center text-gray-600 text-xs uppercase tracking-widest mb-6">Built on enterprise-grade infrastructure</p>
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
          {TECH_PARTNERS.map((p) => (
            <div key={p.name} className="text-center opacity-40 hover:opacity-70 transition-opacity">
              <div className="text-white font-bold text-sm tracking-tight">{p.name}</div>
              <div className="text-gray-500 text-[10px]">{p.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">How it works</motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-extrabold">Live in 48 hours. Running forever.</motion.h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={step.step}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={i}
              className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all"
            >
              <div className="text-5xl font-extrabold text-blue-500/20 mb-4 leading-none">{step.step}</div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Verticals / Solutions ── */}
      <section className="px-6 py-16 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">Solutions by vertical</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-extrabold">Built for your industry. Ready on day one.</motion.h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {VERTICALS.map((v, i) => (
              <motion.div
                key={v.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                custom={i}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-8 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all"
              >
                <span className="text-3xl mb-4">{v.icon}</span>
                <span className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">{v.label}</span>
                <h3 className="text-lg font-bold mb-4 leading-snug">{v.headline}</h3>
                <ul className="space-y-2 mb-8 flex-1">
                  {v.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-blue-400 mt-0.5 flex-shrink-0">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href={v.href}
                  className="text-center text-sm font-semibold px-4 py-2.5 rounded-xl border border-blue-500/40 text-blue-300 hover:bg-blue-500/10 transition-all"
                >
                  {v.cta} →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Compliance strip ── */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="flex flex-col items-center gap-6"
        >
          <motion.p variants={fadeUp} className="text-gray-600 text-xs uppercase tracking-widest">Compliance & certifications</motion.p>
          <motion.div variants={fadeUp} custom={1} className="flex flex-wrap justify-center gap-3">
            {COMPLIANCE.map((c) => (
              <div key={c.label} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                <span className="font-semibold text-gray-200">{c.label}</span>
                <span className="text-gray-600">· {c.desc}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Mission ── */}
      <section className="px-6 py-24 max-w-4xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="flex flex-col items-center gap-6"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-400 text-xs font-semibold tracking-widest uppercase">
            Why NX
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-extrabold leading-tight">
            NX stands for <span className="text-blue-400">Next</span>.
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-gray-400 text-lg leading-relaxed max-w-2xl">
            The next generation of business operations doesn't put callers on hold, lose leads overnight, or require a team to scale. AgentNX is the step beyond — AI voice agents that handle every call, every request, every time, so your people focus on the work that actually moves the mission forward.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 w-full max-w-2xl">
            {[
              { label: "Next availability", desc: "Agents answer in under a second — any hour, any volume." },
              { label: "Next conversation", desc: "Every caller reaches a live voice immediately. No IVR trees." },
              { label: "Next contract", desc: "Purpose-built for federal, pharma, and enterprise procurement." },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left">
                <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">{item.label}</div>
                <div className="text-gray-400 text-sm leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="px-6 py-24 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold mb-4">
            Hear it for yourself.
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-gray-400 text-lg mb-10">
            Talk to Alex — our sales agent — right now. No forms, no demos calls, no waiting.
          </motion.p>
          <motion.div variants={fadeUp} custom={2} className="flex flex-col items-center gap-4">
            <VapiCallButton assistantId={AGENTNX_ASSISTANT_ID} label="Talk to AgentNX — it's free" size="lg" />
            <Link href="/voice" className="text-gray-500 hover:text-gray-300 text-sm transition">
              Or try pharma, government & healthcare demos →
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-8 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <div className="text-lg font-bold mb-1">
              Agent<span className="text-blue-400">NX</span><span className="text-blue-400">.ai</span>
            </div>
            <p className="text-gray-600 text-xs max-w-xs leading-relaxed">
              AI voice agents for pharma, federal agencies, and enterprise sales ops. Deployed in 48 hours.
            </p>
            <p className="text-gray-700 text-xs mt-3">© 2026 IMAGE 101 LLC · Service-Disabled Veteran-Owned Small Business</p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="flex flex-col gap-3">
              <span className="text-gray-600 text-xs uppercase tracking-widest font-bold">Product</span>
              <Link href="/voice" className="text-gray-400 hover:text-white transition">Demos</Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white transition">Pricing</Link>
              <Link href="/mcp-demo" className="text-gray-400 hover:text-white transition">MCP Demo</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-gray-600 text-xs uppercase tracking-widest font-bold">Solutions</span>
              <Link href="/voice" className="text-gray-400 hover:text-white transition">Pharma</Link>
              <Link href="/voice" className="text-gray-400 hover:text-white transition">Federal</Link>
              <Link href="/voice" className="text-gray-400 hover:text-white transition">Sales Ops</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-gray-600 text-xs uppercase tracking-widest font-bold">Company</span>
              <a href="mailto:william@agentnx.ai" className="text-gray-400 hover:text-white transition">Contact</a>
              <a href="https://sam.gov" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">SAM.gov</a>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
