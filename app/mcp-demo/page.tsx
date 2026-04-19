"use client";

import { useState } from "react";

const PRESETS = [
  {
    label: "🚨 Triage Alert",
    message: "Check open high-priority tickets. Find the suspicious login alert and escalate it — create a ticket in the Cybersecurity queue.",
  },
  {
    label: "🔐 ICAM Access Request",
    message: "John Smith (smith.john@va.gov) needs Splunk read access for the SOC project. Check his current access, provision it, and create an audit ticket.",
  },
  {
    label: "🔍 Discover Tools",
    message: "",
    discover: true,
  },
];

export default function McpDemoPage() {
  const [serverUrl, setServerUrl] = useState("https://agentnx.ai/api/mcp-server");
  const [message, setMessage] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [result, setResult] = useState<{ response?: string; tools?: { name: string; description: string }[]; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function runAgent() {
    if (!serverUrl || !message) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/mcp-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverUrl, message, systemPrompt: systemPrompt || undefined }),
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
      const res = await fetch(`/api/mcp-agent?serverUrl=${encodeURIComponent(serverUrl)}`);
      const data = await res.json();
      setResult({ tools: data.tools });
    } catch (e) {
      setResult({ error: String(e) });
    } finally {
      setLoading(false);
    }
  }

  function applyPreset(preset: typeof PRESETS[0]) {
    if ("discover" in preset && preset.discover) {
      discoverTools();
      return;
    }
    setMessage(preset.message);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-4 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">AgentNX · MCP Agent</p>
          <h1 className="text-3xl font-extrabold mb-2">MCP Agent Demo</h1>
          <p className="text-gray-400 text-sm">
            Connect to any MCP server. AgentNX discovers the tools automatically and Claude runs the full workflow.
          </p>
        </div>

        {/* Server URL */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">MCP Server URL</label>
          <input
            value={serverUrl}
            onChange={e => setServerUrl(e.target.value)}
            placeholder="http://localhost:3333/mcp"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-gray-200 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Preset buttons */}
        <div className="flex gap-2 flex-wrap mb-6">
          {PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              disabled={loading}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-blue-400 hover:text-blue-300 text-gray-400 transition disabled:opacity-40"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Message */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Message / Request</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={3}
            placeholder="e.g. Check open high-priority tickets and triage the suspicious login alert..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition resize-none"
          />
        </div>

        {/* System prompt (collapsed) */}
        <details className="mb-6">
          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 transition">Advanced — override system prompt</summary>
          <textarea
            value={systemPrompt}
            onChange={e => setSystemPrompt(e.target.value)}
            rows={3}
            placeholder="Leave blank to use default AgentNX prompt..."
            className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition resize-none"
          />
        </details>

        {/* Run button */}
        <button
          onClick={runAgent}
          disabled={loading || !serverUrl || !message}
          className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 font-semibold text-sm transition mb-8"
        >
          {loading ? "Agent running…" : "Run Agent →"}
        </button>

        {/* Result */}
        {result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

            {result.error && (
              <div className="text-red-400 text-sm font-mono">{result.error}</div>
            )}

            {result.tools && (
              <div>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Tools Discovered</p>
                <div className="space-y-3">
                  {result.tools.map(t => (
                    <div key={t.name} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                      <div className="font-mono text-sm text-blue-300 mb-1">{t.name}()</div>
                      <div className="text-xs text-gray-400">{t.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.response && (
              <div>
                <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-4">Agent Response</p>
                <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{result.response}</div>
              </div>
            )}

          </div>
        )}

      </div>
    </main>
  );
}
