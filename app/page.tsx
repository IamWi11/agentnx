"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

const PROOF = [
  { stat: "24/7", label: "Always on" },
  { stat: "< 1s", label: "Response time" },
  { stat: "0", label: "Hold time" },
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

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white overflow-hidden flex flex-col">

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-8 py-5"
      >
        <span className="text-xl font-bold tracking-tight">
          Agent<span className="text-blue-400">NX</span>
          <span className="text-blue-400">.ai</span>
        </span>
        <div className="flex items-center gap-6">
          <a href="/pricing" className="text-gray-400 hover:text-white text-sm transition">Pricing</a>
          <a href="/voice" className="text-gray-400 hover:text-white text-sm transition">Demos</a>
          <VapiCallButton assistantId={AGENTNX_ASSISTANT_ID} label="Talk to AgentNX" size="sm" />
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 flex-1 py-20">

        {/* Gradient orbs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3], x: [0, 30, -20, 0], y: [0, -20, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15], x: [0, -40, 20, 0], y: [0, 20, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-500/15 rounded-full blur-[100px] pointer-events-none"
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

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight max-w-4xl mb-6 relative z-10"
        >
          Your business handles{" "}
          <TypewriterText words={["1,000 calls a day.", "every support ticket.", "every request.", "it all — automatically."]} />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg text-gray-400 max-w-xl mb-12 relative z-10"
        >
          AgentNX deploys AI voice agents that answer calls, qualify leads, and resolve requests — without a single person picking up the phone.
        </motion.p>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col items-center gap-3 relative z-10"
        >
          <VapiCallButton assistantId={AGENTNX_ASSISTANT_ID} label="Talk to AgentNX — it's free" size="lg" />
          <p className="text-gray-600 text-xs">No signup. Talk to the agent and see if it's right for your business.</p>
        </motion.div>

        {/* Proof points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex gap-12 mt-20 relative z-10"
        >
          {PROOF.map(({ stat, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-extrabold text-blue-400">{stat}</div>
              <div className="text-gray-500 text-xs mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-6 text-center text-gray-700 text-xs">
        © 2026 AgentNX.ai · IMAGE 101 LLC · Service-Disabled Veteran-Owned Small Business
        <span className="mx-3">·</span>
        <a href="/pricing" className="hover:text-gray-400 transition">Pricing</a>
        <span className="mx-3">·</span>
        <a href="/mcp-demo" className="hover:text-gray-400 transition">MCP Demo</a>
      </footer>

    </main>
  );
}
