"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const TurnstileWidget = dynamic(() => import("../components/TurnstileWidget"), { ssr: false });

export default function DeviationReport() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [form, setForm] = useState({
    site: "",
    product: "",
    batchNumber: "",
    deviationDate: "",
    discoveredBy: "",
    department: "",
    description: "",
    immediateActions: "",
    potentialImpact: "",
    reportedBy: "",
    submitterEmail: "",
    qaManagerEmail: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      alert("Please complete the security check.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/submit-deviation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Error submitting. Please try again.");
      }
    } catch {
      alert("Error submitting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <main className="min-h-screen bg-[#0a0f1e] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-extrabold mb-3">Report Submitted</h1>
          <p className="text-gray-400 mb-2">Your deviation report has been generated and routed to QA for approval.</p>
          <p className="text-gray-400 mb-8">Check your email for a copy of the full report.</p>
          <a href="/" className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3 rounded-full transition">
            Back to AgentNX
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <a href="/" className="text-blue-400 text-sm mb-4 inline-block">← Back to AgentNX</a>
          <h1 className="text-4xl font-extrabold mb-2">
            Deviation <span className="text-blue-400">Workflow Agent</span>
          </h1>
          <p className="text-gray-400">Submit an incident. The agent generates your GMP report and routes it to QA automatically.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Site & Product */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Site / Facility</label>
              <input name="site" required value={form.site} onChange={handleChange}
                placeholder="e.g. Building 3, Suite 200"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Product Name</label>
              <input name="product" required value={form.product} onChange={handleChange}
                placeholder="e.g. Drug Product XYZ"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
            </div>
          </div>

          {/* Batch & Date */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Batch / Lot Number</label>
              <input name="batchNumber" required value={form.batchNumber} onChange={handleChange}
                placeholder="e.g. LOT-2026-001"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Date of Deviation</label>
              <input name="deviationDate" type="date" required value={form.deviationDate} onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
            </div>
          </div>

          {/* Discovered By & Department */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Discovered By</label>
              <input name="discoveredBy" required value={form.discoveredBy} onChange={handleChange}
                placeholder="Name / Title"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Department</label>
              <input name="department" required value={form.department} onChange={handleChange}
                placeholder="e.g. Quality Assurance"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1">Deviation Description</label>
            <textarea name="description" required value={form.description} onChange={handleChange} rows={4}
              placeholder="Describe what happened, when, and how it was discovered..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none" />
          </div>

          {/* Immediate Actions */}
          <div>
            <label className="block text-sm font-semibold mb-1">Immediate Actions Taken</label>
            <textarea name="immediateActions" required value={form.immediateActions} onChange={handleChange} rows={3}
              placeholder="What actions were taken immediately after discovery?"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none" />
          </div>

          {/* Potential Impact */}
          <div>
            <label className="block text-sm font-semibold mb-1">Potential Impact / Risk</label>
            <textarea name="potentialImpact" required value={form.potentialImpact} onChange={handleChange} rows={3}
              placeholder="Describe potential impact on product quality, patient safety, or compliance..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none" />
          </div>

          {/* Emails */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-sm text-gray-300">Routing & Notification</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Your Email</label>
                <input name="submitterEmail" type="email" required value={form.submitterEmail} onChange={handleChange}
                  placeholder="you@company.com"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">QA Manager Email</label>
                <input name="qaManagerEmail" type="email" required value={form.qaManagerEmail} onChange={handleChange}
                  placeholder="qa.manager@company.com"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Report Prepared By</label>
              <input name="reportedBy" required value={form.reportedBy} onChange={handleChange}
                placeholder="Your name and title"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
            </div>
          </div>

          {/* Turnstile CAPTCHA */}
          <div className="flex justify-center">
            <TurnstileWidget
              onSuccess={(token) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken("")}
              onError={() => setTurnstileToken("")}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !turnstileToken}
            className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-base transition"
          >
            {loading ? "Agent Working — Generating & Routing Report..." : "Submit to AgentNX Workflow →"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-6">
          AI-generated report — always review before final submission. AgentNX.ai
        </p>
        <p className="text-center text-gray-700 text-xs mt-2">
          Submitted data is used solely to generate and route your deviation report. It is not stored beyond delivery.
          AgentNX.ai is a product of IMAGE 101 LLC — a Service-Disabled Veteran-Owned Small Business.
        </p>
      </div>
    </main>
  );
}
