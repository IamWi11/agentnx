"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
  };

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <span className="text-xl font-bold tracking-tight">
          Agent<span className="text-blue-400">NX</span>
          <span className="text-blue-400">.ai</span>
        </span>
        <div className="flex items-center gap-4">
          <a href="/deviation" className="text-gray-400 hover:text-white text-sm transition">Try Demo</a>
          <a href="#book-demo"
            className="bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold px-5 py-2 rounded-full transition">
            Book a Demo
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-28 pb-20">
        <div className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
          AI Agents for Pharma &amp; Biotech
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight max-w-4xl mb-6">
          The AI Agent That Runs Your{" "}
          <span className="text-blue-400">Compliance Workflows</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mb-10">
          AgentNX handles your entire deviation management process — from incident detection to CAPA closure.
          No more chasing approvals, missing deadlines, or hours of documentation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#book-demo"
            className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3.5 rounded-full text-base transition">
            Book a Demo
          </a>
          <a href="/deviation"
            className="border border-white/20 hover:border-blue-400 text-white font-semibold px-8 py-3.5 rounded-full text-base transition">
            Try it Free →
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">How AgentNX Works</h2>
        <p className="text-gray-400 text-center mb-14 max-w-xl mx-auto">
          One agent handles your entire deviation workflow — start to finish.
        </p>
        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-blue-500/20" />
          <div className="grid md:grid-cols-5 gap-6 relative">
            {[
              { step: "1", icon: "🚨", title: "Incident Reported", desc: "Team member submits incident via simple form" },
              { step: "2", icon: "📋", title: "Report Generated", desc: "AI drafts full GMP deviation report instantly" },
              { step: "3", icon: "✉️", title: "Routed for Approval", desc: "QA manager notified and reviews in one click" },
              { step: "4", icon: "✅", title: "CAPA Assigned", desc: "Agent creates tasks, assigns owners, sets deadlines" },
              { step: "5", icon: "🔒", title: "Deviation Closed", desc: "Agent tracks completion and closes the loop" },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-2xl mb-4 relative z-10">
                  {item.icon}
                </div>
                <div className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">Step {item.step}</div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="bg-white/5 border-y border-white/10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Replace Manual Compliance Work</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                before: "2–3 hours writing each deviation report",
                after: "10 minutes — AI drafts, you review",
              },
              {
                before: "Chasing QA managers for approvals via email",
                after: "Automatic routing with one-click approval",
              },
              {
                before: "CAPA tasks tracked in spreadsheets",
                after: "Agent assigns, tracks, and reminds automatically",
              },
              {
                before: "Deviations left open for months",
                after: "Automated closure when all CAPAs are complete",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-red-400 text-lg mt-0.5">✗</span>
                  <p className="text-gray-400 text-sm">{item.before}</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 text-lg mt-0.5">✓</span>
                  <p className="text-white text-sm font-medium">{item.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof placeholder */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Built for Pharma Teams</h2>
        <p className="text-gray-400 mb-10 max-w-xl mx-auto">
          Designed from the ground up for GMP manufacturing environments with 21 CFR Part 11 compliance in mind.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { stat: "21 CFR Part 11", label: "Compliance Ready" },
            { stat: "< 10 min", label: "Per Deviation Report" },
            { stat: "100%", label: "Audit Trail Maintained" },
          ].map((item) => (
            <div key={item.stat} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-3xl font-extrabold text-blue-400 mb-1">{item.stat}</div>
              <div className="text-gray-400 text-sm">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Book a Demo */}
      <section id="book-demo" className="flex flex-col items-center text-center px-6 py-24 bg-white/5 border-t border-white/10">
        <h2 className="text-3xl font-bold mb-3">See AgentNX in Action</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          We&apos;ll walk you through a live demo using a real deviation scenario from your environment.
        </p>
        {submitted ? (
          <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-8 py-4 rounded-2xl font-semibold">
            Thanks! We&apos;ll reach out within 24 hours to schedule your demo.
          </div>
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
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-6 text-center text-gray-600 text-sm">
        © 2026 AgentNX.ai — AI Agents for Pharma Operations
      </footer>
    </main>
  );
}
