"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import VapiCallButton from "./components/VapiCallButton";

const AGENTNX_ASSISTANT_ID = "b14094a0-22a6-46e2-8aa0-b00435d85dd0";

// Count-up hook
function useCountUp(target: number | string, inView: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (typeof target === "string") return;
    let start = 0;
    const duration = 1500;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);
  return count;
}

function StatCard({ stat, label }: { stat: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const isNumeric = /^\d+/.test(stat);
  const numericPart = isNumeric ? parseInt(stat.replace(/\D/g, "")) : 0;
  const prefix = stat.match(/^[^0-9]*/)?.[0] || "";
  const suffix = stat.match(/[^0-9]*$/)?.[0] || "";
  const count = useCountUp(isNumeric ? numericPart : 0, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6"
    >
      <div className="text-3xl font-extrabold text-blue-400 mb-1">
        {isNumeric ? `${prefix}${count}${suffix}` : stat}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </motion.div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeIndustry, setActiveIndustry] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/request-demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSubmitted(true);
    setEmail("");
  };

  const industries = [
    {
      icon: "🏛️",
      label: "Government",
      headline: "Automate Federal Compliance Workflows",
      desc: "AI agents that handle documentation, routing, approvals, and audit trails — built for SAM.gov registered contractors and federal agencies.",
      tags: ["DFARS Compliant", "Audit Trail", "Role-Based Approvals"],
    },
    {
      icon: "🔬",
      label: "Pharma & Biotech",
      headline: "Eliminate Manual Deviation Management",
      desc: "From incident submission to CAPA closure — AgentNX automates your entire GMP deviation workflow in minutes, not hours.",
      tags: ["21 CFR Part 11", "< 10 min Reports", "GMP Ready"],
    },
    {
      icon: "🔒",
      label: "Cybersecurity",
      headline: "Accelerate Security Incident Response",
      desc: "AI agents that triage alerts, generate incident reports, route to the right teams, and track remediation — end to end.",
      tags: ["Incident Triage", "Auto-Routing", "Remediation Tracking"],
    },
    {
      icon: "🏥",
      label: "Healthcare",
      headline: "Streamline Clinical Operations",
      desc: "Automate compliance documentation, staff notifications, and workflow approvals across your clinical and administrative teams.",
      tags: ["HIPAA Aware", "Workflow Automation", "Audit Ready"],
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white overflow-hidden">
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-8 py-5 border-b border-white/10"
      >
        <span className="text-xl font-bold tracking-tight">
          Agent<span className="text-blue-400">NX</span>
          <span className="text-blue-400">.ai</span>
        </span>
        <div className="flex items-center gap-4">
          <a href="/voice" className="text-gray-400 hover:text-white text-sm transition">Voice Agents</a>
          <a href="/deviation" className="text-gray-400 hover:text-white text-sm transition">Try Demo</a>
          <a href="/pricing" className="text-gray-400 hover:text-white text-sm transition">Pricing</a>
          <a href="#book-demo"
            className="bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold px-5 py-2 rounded-full transition">
            Book a Demo
          </a>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-6 pt-28 pb-20">
        {/* Animated gradient orb */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, -20, 0],
            y: [0, -20, 10, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15],
            x: [0, -40, 20, 0],
            y: [0, 20, -10, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-500/15 rounded-full blur-[100px] pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 relative z-10"
        >
          AI Agents for Enterprise &amp; Government Operations
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-6xl font-extrabold leading-tight max-w-4xl mb-6 relative z-10"
        >
          AI Agents That{" "}
          <span className="text-blue-400">Automate Your Operations</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg text-gray-400 max-w-2xl mb-10 relative z-10"
        >
          AgentNX deploys intelligent agents that handle documentation, approvals, routing, and compliance workflows — across government, pharma, cybersecurity, and healthcare.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mb-8 relative z-10"
        >
          <a href="#book-demo"
            className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3.5 rounded-full text-base transition">
            Book a Demo
          </a>
          <a href="/deviation"
            className="border border-white/20 hover:border-blue-400 text-white font-semibold px-8 py-3.5 rounded-full text-base transition">
            Try it Free →
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col items-center gap-2 relative z-10"
        >
          <div className="text-gray-500 text-xs uppercase tracking-widest mb-1">Or talk to the AI right now</div>
          <VapiCallButton
            assistantId={AGENTNX_ASSISTANT_ID}
            label="Talk to AgentNX AI"
            size="md"
          />
        </motion.div>
      </section>

      {/* Industry Tabs */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="max-w-5xl mx-auto px-6 py-16"
      >
        <motion.h2 variants={fadeUp} className="text-3xl font-bold text-center mb-4">Built for Your Industry</motion.h2>
        <motion.p variants={fadeUp} className="text-gray-400 text-center mb-10 max-w-xl mx-auto">
          One platform. Multiple use cases. Pick your industry to see AgentNX in action.
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 mb-10">
          {industries.map((ind, i) => (
            <button
              key={i}
              onClick={() => setActiveIndustry(i)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition ${
                activeIndustry === i
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "border-white/20 text-gray-400 hover:border-blue-400 hover:text-white"
              }`}
            >
              {ind.icon} {ind.label}
            </button>
          ))}
        </motion.div>
        <motion.div variants={fadeUp} className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center overflow-hidden relative min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndustry}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-4xl mb-4">{industries[activeIndustry].icon}</div>
              <h3 className="text-2xl font-bold mb-3">{industries[activeIndustry].headline}</h3>
              <p className="text-gray-400 max-w-xl mx-auto mb-6">{industries[activeIndustry].desc}</p>
              <div className="flex flex-wrap justify-center gap-3">
                {industries[activeIndustry].tags.map((tag) => (
                  <span key={tag} className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold px-4 py-1.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.section>

      {/* How it works */}
      <section className="bg-white/5 border-y border-white/10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-4"
          >
            How AgentNX Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-400 text-center mb-14 max-w-xl mx-auto"
          >
            One agent handles your entire workflow — from incident to resolution.
          </motion.p>
          <div className="relative">
            {/* Animated connector line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
              style={{ originX: 0 }}
              className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-blue-500/40"
            />
            <div className="grid md:grid-cols-5 gap-6 relative">
              {[
                { step: "1", icon: "🚨", title: "Event Detected", desc: "Team member or system submits event via simple form" },
                { step: "2", icon: "📋", title: "Report Generated", desc: "AI drafts full documentation report instantly" },
                { step: "3", icon: "✉️", title: "Routed for Approval", desc: "Right person notified and reviews in one click" },
                { step: "4", icon: "✅", title: "Tasks Assigned", desc: "Agent creates tasks, assigns owners, sets deadlines" },
                { step: "5", icon: "🔒", title: "Workflow Closed", desc: "Agent tracks completion and closes the loop" },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-2xl mb-4 relative z-10">
                    {item.icon}
                  </div>
                  <div className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">Step {item.step}</div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="max-w-5xl mx-auto px-6 py-16"
      >
        <motion.h2 variants={fadeUp} className="text-3xl font-bold text-center mb-12">Replace Manual Work With AI</motion.h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              before: "Hours writing compliance and incident reports",
              after: "AI drafts in minutes — you review and approve",
            },
            {
              before: "Chasing people for approvals via email",
              after: "Automatic routing with one-click approval",
            },
            {
              before: "Tasks tracked in spreadsheets and sticky notes",
              after: "Agent assigns, tracks, and reminds automatically",
            },
            {
              before: "Workflows left open for weeks with no visibility",
              after: "Automated closure with full audit trail",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-red-400 text-lg mt-0.5">✗</span>
                <p className="text-gray-400 text-sm">{item.before}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 text-lg mt-0.5">✓</span>
                <p className="text-white text-sm font-medium">{item.after}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Stats */}
      <section className="bg-white/5 border-y border-white/10 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-12"
          >
            Why AgentNX
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { stat: "10", label: "Per Report Generated", prefix: "< ", suffix: " min" },
              { stat: "100", label: "Audit Trail Maintained", suffix: "%" },
              { stat: "4", label: "Industries Supported", suffix: "+" },
              { stat: "SDVOSB", label: "Veteran-Owned Business" },
            ].map((item) => (
              <StatCard key={item.label} stat={item.prefix ? `${item.prefix}${item.stat}${item.suffix || ""}` : `${item.stat}${item.suffix || ""}`} label={item.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Voice Agents CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-6 py-16"
      >
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-10 text-center">
          <div className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Voice AI
          </div>
          <h2 className="text-3xl font-bold mb-3">
            Talk to an <span className="text-blue-400">AI Agent Live</span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto text-sm">
            AgentNX voice agents handle inbound calls, answer compliance questions, route requests, and guide users through workflows — all hands-free. Try our live demos now.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/voice"
              className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3 rounded-full text-sm transition"
            >
              Try Voice Agents →
            </a>
            <VapiCallButton
              assistantId={AGENTNX_ASSISTANT_ID}
              label="Call AgentNX Now"
              size="md"
            />
          </div>
        </div>
      </motion.section>

      {/* Book a Demo */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        id="book-demo"
        className="flex flex-col items-center text-center px-6 py-24"
      >
        <h2 className="text-3xl font-bold mb-3">See AgentNX in Action</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          We&apos;ll walk you through a live demo tailored to your industry and use case.
        </p>
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-8 py-4 rounded-2xl font-semibold"
          >
            Thanks! We&apos;ll reach out within 24 hours to schedule your demo.
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md">
            <input
              type="email" required placeholder="your@company.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-full px-5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
            />
            <button type="submit"
              className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-3 rounded-full text-sm transition">
              Request a Demo
            </button>
            <p className="text-gray-600 text-xs">No commitment. 30-minute call. We&apos;ll come prepared.</p>
          </form>
        )}
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-6 text-center text-gray-600 text-sm">
        © 2026 AgentNX.ai — AI Agents for Enterprise &amp; Government Operations
        <span className="mx-3">·</span>
        <span>A product of IMAGE 101 LLC</span>
        <span className="mx-3">·</span>
        <span>Service-Disabled Veteran-Owned Small Business</span>
      </footer>
    </main>
  );
}
