"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const PRESETS = [
  {
    label: "🚨 Triage Alert",
    tag: "Cybersecurity",
    message: "Check open high-priority tickets. Find the suspicious login alert and escalate it — create a ticket in the Cybersecurity queue.",
  },
  {
    label: "🔐 ICAM Access Request",
    tag: "Government IT",
    message: "John Smith (smith.john@va.gov) needs Splunk read access for the SOC project. Check his current access, provision it, and create an audit ticket.",
  },
  {
    label: "🔍 Discover Tools",
    tag: "Explore",
    message: "",
    discover: true,
  },
];

const HOW_IT_WORKS = [
  { n: "01", title: "Connect any MCP server", desc: "Paste a server URL — AgentNX auto-discovers every tool it exposes." },
  { n: "02", title: "Describe the task", desc: "Write a natural-language request. The agent plans the steps and selects the right tools." },
  { n: "03", title: "Agent executes", desc: "Claude runs the full workflow — tickets, access provisioning, escalations — and returns a structured response." },
];

export default function McpDemoPage() {
  const [serverUrl, setServerUrl] = useState("https://agentnx.ai/api/mcp-server");
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [result, setResult] = useState<{ response?: string; tools?: { name: string; description: string }[]; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  async function runAgent() {
    if (!serverUrl || !message) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/mcp-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverUrl, apiKey: apiKey || undefined, message, systemPrompt: systemPrompt || undefined }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: String(e) });
    } finally {
      setLoading(false);
    }
  }

  async function discoverTools() {
    if (!serverUrl) return;
    setLoading(true);
    setResult(null);
    try {
      const params = new URLSearchParams({ serverUrl });
      if (apiKey) params.set("apiKey", apiKey);
      const res = await fetch(`/api/mcp-agent?${params}`);
      const data = await res.json();
      setResult({ tools: data.tools });
    } catch (e) {
      setResult({ error: String(e) });
    } finally {
      setLoading(false);
    }
  }

  function applyPreset(preset: typeof PRESETS[0]) {
    setActivePreset(preset.label);
    if ("discover" in preset && preset.discover) {
      discoverTools();
      return;
    }
    setMessage(preset.message);
  }

  return (
    <main className="min-h-screen bg-[#080c18] text-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5 sticky top-0 z-50 backdrop-blur-md bg-[#080c18]/80">
        <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          Agent<span className="text-blue-400">NX</span>
          <span className="text-blue-400">.ai</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link href="/voice" className="text-gray-400 hover:text-white text-sm transition">Demos</Link>
          <Link href="/pricing" className="text-gray-400 hover:text-white text-sm transition">Pricing</Link>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <motion.div initial="hidden" animate="visible" className="flex flex-col items-center gap-4">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Model Context Protocol · Live Agent
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl leading-tight">
            Connect any system.<br />
            <span className="text-blue-400">Let the agent handle it.</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-gray-400 max-w-lg leading-relaxed">
            Paste any MCP server URL. AgentNX discovers the tools and Claude executes the full workflow — tickets, access provisioning, triage, and more.
          </motion.p>
        </motion.div>
      </div>

      {/* How it works */}
      <div className="max-w-4xl mx-auto px-6 mb-14">
        <div className="grid md:grid-cols-3 gap-4">
          {HOW_IT_WORKS.map((item, i) => (
            <motion.div
              key={item.n}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={i}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 font-bold flex items-center justify-center mb-3 text-xs">
                {item.n}
              </div>
              <div className="font-semibold text-sm mb-1">{item.title}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{item.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Demo panel */}
      <div className="max-w-4xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-8"
        >
          {/* Server URL + API Key */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">MCP Server URL</label>
              <input
                value={serverUrl}
                onChange={e => setServerUrl(e.target.value)}
                placeholder="https://agentnx.ai/api/mcp-server"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-gray-200 focus:outline-none focus:border-blue-500/60 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Bearer token (required for agentnx.ai)"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-gray-200 focus:outline-none focus:border-blue-500/60 transition"
              />
            </div>
          </div>

          {/* Preset buttons */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Quick Presets</label>
            <div className="flex gap-2 flex-wrap">
              {PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p)}
                  disabled={loading}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition disabled:opacity-40 ${
                    activePreset === p.label
                      ? "bg-blue-500/20 border-blue-500/60 text-blue-300"
                      : "bg-white/5 border-white/10 hover:border-blue-400 hover:text-blue-300 text-gray-400"
                  }`}
                >
                  {p.label}
                  <span className="text-[10px] text-gray-600 font-normal">{p.tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Request</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              placeholder="e.g. Check open high-priority tickets and triage the suspicious login alert..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500/60 transition resize-none"
            />
          </div>

          {/* Advanced */}
          <details className="mb-6">
            <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-400 transition select-none">
              Advanced — override system prompt
            </summary>
            <textarea
              value={systemPrompt}
              onChange={e => setSystemPrompt(e.target.value)}
              rows={3}
              placeholder="Leave blank to use default AgentNX prompt..."
              className="mt-3 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500/60 transition resize-none"
            />
          </details>

          {/* Run button */}
          <button
            onClick={runAgent}
            disabled={loading || !serverUrl || !message}
            className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 font-semibold text-sm transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Agent running…
              </>
            ) : (
              "Run Agent →"
            )}
          </button>
        </motion.div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-8"
            >
              {result.error && (
                <div>
                  <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">Error</p>
                  <div className="text-red-400 text-sm font-mono leading-relaxed">{result.error}</div>
                </div>
              )}

              {result.tools && (
                <div>
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">
                    {result.tools.length} Tools Discovered
                  </p>
                  <div className="space-y-3">
                    {result.tools.map(t => (
                      <div key={t.name} className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3">
                        <div className="font-mono text-sm text-blue-300 mb-1">{t.name}()</div>
                        <div className="text-xs text-gray-500 leading-relaxed">{t.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.response && (
                <div>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">Agent Response</p>
                  <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{result.response}</div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-14 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 p-10 text-center"
        >
          <motion.h3 variants={fadeUp} className="text-2xl font-extrabold mb-2">Want this connected to your systems?</motion.h3>
          <motion.p variants={fadeUp} custom={1} className="text-gray-400 mb-8 max-w-lg mx-auto text-sm leading-relaxed">
            AgentNX can connect to ServiceNow, Splunk, Veeva Vault, Active Directory, and more — and expose them as MCP tools your agents can use in real time.
          </motion.p>
          <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:william@agentnx.ai?subject=MCP Integration"
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
        <Link href="/voice" className="hover:text-gray-400 transition">Voice Demos</Link>
        <span className="mx-3">·</span>
        <Link href="/pricing" className="hover:text-gray-400 transition">Pricing</Link>
      </footer>
    </main>
  );
}
