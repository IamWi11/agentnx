"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up to email service (Resend, Mailchimp, etc.)
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
        <a
          href="#waitlist"
          className="bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold px-5 py-2 rounded-full transition"
        >
          Request Early Access
        </a>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-28 pb-20">
        <div className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
          Built for Pharma &amp; Biotech
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight max-w-3xl mb-6">
          AI Agents That Work Inside{" "}
          <span className="text-blue-400">Pharma Operations</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mb-10">
          AgentNX automates your most time-consuming compliance and manufacturing
          tasks — deviation reports, batch records, SOPs — so your team can
          focus on what matters.
        </p>
        <a
          href="#waitlist"
          className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3.5 rounded-full text-base transition"
        >
          Join the Waitlist
        </a>
      </section>

      {/* Problems we solve */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Stop Wasting Hours on Paperwork
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "📋",
              title: "Deviation Reports",
              desc: "Auto-draft GMP deviation reports from incident inputs. Review and sign off in minutes, not hours.",
            },
            {
              icon: "🧪",
              title: "Batch Records",
              desc: "Generate and validate batch manufacturing records with full traceability and 21 CFR Part 11 compliance.",
            },
            {
              icon: "📄",
              title: "SOP Authoring",
              desc: "Create and update Standard Operating Procedures from process descriptions — formatted and audit-ready.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/40 transition"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why AgentNX */}
      <section className="bg-white/5 border-y border-white/10 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Why AgentNX?</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">
            Built by pharma IT professionals who lived these problems firsthand.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                stat: "FDA-Ready",
                desc: "Designed with 21 CFR Part 11 and GMP compliance in mind from day one.",
              },
              {
                stat: "10x Faster",
                desc: "Cut documentation time from hours to minutes on every deviation or batch record.",
              },
              {
                stat: "No IT Team Needed",
                desc: "Simple web interface — your QA and ops teams can use it without any training.",
              },
            ].map((item) => (
              <div key={item.stat}>
                <div className="text-2xl font-extrabold text-blue-400 mb-2">
                  {item.stat}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="flex flex-col items-center text-center px-6 py-24">
        <h2 className="text-3xl font-bold mb-3">Get Early Access</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          We&apos;re onboarding a small group of pharma and biotech teams first.
          Join the waitlist to be first in line.
        </p>
        {submitted ? (
          <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-8 py-4 rounded-2xl font-semibold">
            You&apos;re on the list! We&apos;ll be in touch soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <input
              type="email"
              required
              placeholder="your@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-3 rounded-full text-sm transition whitespace-nowrap"
            >
              Join Waitlist
            </button>
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
