"use client";

import { useState, useEffect } from "react";

interface VaultDocument {
  id: string;
  name: string;
  type: string;
  status: "draft" | "in_review" | "pending_approval" | "approved" | "rejected";
  owner: string;
  daysInStatus: number;
  product: string;
  version: string;
}

interface AuditEntry {
  timestamp: string;
  documentId: string;
  documentName: string;
  agentAction: string;
  riskLevel: string;
  routingTarget: string;
  reason: string;
  auditNote: string;
}

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  in_review: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  pending_approval: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  approved: "bg-green-500/20 text-green-400 border-green-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  in_review: "In Review",
  pending_approval: "Pending Approval",
  approved: "Approved",
  rejected: "Rejected",
};

const RISK_STYLES: Record<string, string> = {
  Low: "text-green-400",
  Medium: "text-yellow-400",
  High: "text-orange-400",
  Critical: "text-red-400",
};

export default function VeevaDemo() {
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);
  const [runningAll, setRunningAll] = useState(false);
  const [processedIds, setProcessedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/veeva-agent")
      .then((r) => r.json())
      .then((data) => setDocuments(data.documents));
  }, []);

  const processDocument = async (docId: string) => {
    setProcessing(docId);
    try {
      const res = await fetch("/api/veeva-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: docId }),
      });
      const data = await res.json();
      if (data.success) {
        setAuditLog((prev) => [data.result, ...prev]);
        setProcessedIds((prev) => new Set([...prev, docId]));
      }
    } finally {
      setProcessing(null);
    }
  };

  const runAllPending = async () => {
    setRunningAll(true);
    const pending = documents.filter(
      (d) => (d.status === "pending_approval" || d.status === "in_review") && !processedIds.has(d.id)
    );
    for (const doc of pending) {
      await processDocument(doc.id);
      await new Promise((r) => setTimeout(r, 600));
    }
    setRunningAll(false);
  };

  const pendingCount = documents.filter(
    (d) => (d.status === "pending_approval" || d.status === "in_review") && !processedIds.has(d.id)
  ).length;

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <a href="/" className="text-xl font-bold tracking-tight">
          Agent<span className="text-blue-400">NX</span>
          <span className="text-blue-400">.ai</span>
        </a>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">Veeva Vault Integration</span>
          <span className="bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold px-3 py-1 rounded-full">
            ● Live Demo
          </span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            AgentNX × Veeva Vault
          </div>
          <h1 className="text-4xl font-extrabold mb-3">
            AI-Powered Vault <span className="text-blue-400">Document Agent</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">
            AgentNX continuously monitors your Veeva Vault for documents requiring action — automatically routing approvals, flagging overdue reviews, and maintaining a full audit trail. No manual follow-up needed.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Documents", value: documents.length.toString() },
            { label: "Pending Action", value: documents.filter((d) => d.status === "pending_approval" || d.status === "in_review").length.toString() },
            { label: "Agent Actions Taken", value: auditLog.length.toString() },
            { label: "Avg Days in Status", value: documents.length ? Math.round(documents.reduce((a, d) => a + d.daysInStatus, 0) / documents.length).toString() : "0" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-extrabold text-blue-400 mb-1">{stat.value}</div>
              <div className="text-gray-400 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Run Agent Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Vault Document Queue</h2>
          <button
            onClick={runAllPending}
            disabled={runningAll || pendingCount === 0}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-full text-sm transition"
          >
            {runningAll ? (
              <>
                <span className="animate-spin">⟳</span> Agent Running...
              </>
            ) : (
              <>▶ Run Agent on {pendingCount} Pending</>
            )}
          </button>
        </div>

        {/* Document Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-4">Document</th>
                <th className="text-left px-5 py-4">Type</th>
                <th className="text-left px-5 py-4">Product</th>
                <th className="text-left px-5 py-4">Status</th>
                <th className="text-left px-5 py-4">Days</th>
                <th className="text-left px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => {
                const isProcessed = processedIds.has(doc.id);
                const isProcessing = processing === doc.id;
                const canProcess = (doc.status === "pending_approval" || doc.status === "in_review") && !isProcessed;

                return (
                  <tr key={doc.id} className={`border-b border-white/5 hover:bg-white/5 transition ${isProcessed ? "opacity-60" : ""}`}>
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">{doc.name}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{doc.id} · {doc.version}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-400">{doc.type}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{doc.product}</td>
                    <td className="px-5 py-4">
                      <span className={`border text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[doc.status]}`}>
                        {STATUS_LABELS[doc.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-bold ${doc.daysInStatus >= 10 ? "text-orange-400" : doc.daysInStatus >= 5 ? "text-yellow-400" : "text-gray-400"}`}>
                        {doc.daysInStatus}d
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {isProcessed ? (
                        <span className="text-green-400 text-xs font-semibold">✓ Processed</span>
                      ) : canProcess ? (
                        <button
                          onClick={() => processDocument(doc.id)}
                          disabled={isProcessing || runningAll}
                          className="text-blue-400 hover:text-blue-300 text-xs font-semibold disabled:opacity-40 transition"
                        >
                          {isProcessing ? "Processing..." : "Run Agent →"}
                        </button>
                      ) : (
                        <span className="text-gray-600 text-xs">No action needed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Audit Log */}
        {auditLog.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Agent Audit Log</h2>
            <div className="space-y-4">
              {auditLog.map((entry, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-white">{entry.documentName}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{entry.documentId} · {new Date(entry.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${RISK_STYLES[entry.riskLevel] ?? "text-gray-400"}`}>
                        {entry.riskLevel} Risk
                      </span>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                      <div className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">Agent Action</div>
                      <div className="text-white font-semibold">{entry.agentAction}</div>
                      <div className="text-gray-400 text-xs mt-1">→ {entry.routingTarget}</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Reason</div>
                      <div className="text-gray-300 text-xs leading-relaxed">{entry.reason}</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-500">
                    <span className="font-semibold text-gray-400">Audit Trail: </span>{entry.auditNote}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to Connect Your Vault?</h3>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto text-sm">
            This demo uses mock data. With your Veeva Vault credentials, AgentNX connects directly to your live Vault — monitoring documents, routing approvals, and closing the loop automatically.
          </p>
          <a href="/#book-demo" className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3 rounded-full text-sm transition">
            Book a Live Demo
          </a>
        </div>
      </div>

      <footer className="border-t border-white/10 px-8 py-6 text-center text-gray-600 text-sm mt-10">
        © 2026 AgentNX.ai — AI Agents for Enterprise & Government Operations
        <span className="mx-3">·</span>
        <span>A product of IMAGE 101 LLC · Service-Disabled Veteran-Owned Small Business</span>
      </footer>
    </main>
  );
}
