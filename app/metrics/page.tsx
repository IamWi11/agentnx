"use client";

import { useState } from "react";

const SITES = ["Houston TX — Suite 100", "Tübingen DE", "Munich DE"];
const PRODUCTS = ["anzu-cel (IMA203)", "IMA203CD8", "IMA402"];
const CRITICALITY = ["Critical", "Major", "Minor"];
const STATUSES = ["Open", "Under Review", "CAPA Pending", "Closed"];

const DEMO_DEVIATIONS = [
  { id: "DEV-2026-041", date: "Apr 16", product: "anzu-cel (IMA203)", site: "Houston TX — Suite 100", criticality: "Critical", type: "Temperature Excursion", status: "CAPA Pending", owner: "J. Pinkhasov", daysOpen: 1 },
  { id: "DEV-2026-038", date: "Apr 14", product: "anzu-cel (IMA203)", site: "Houston TX — Suite 100", criticality: "Major", type: "Process Deviation — Cell Yield", status: "Under Review", owner: "R. Horton", daysOpen: 3 },
  { id: "DEV-2026-035", date: "Apr 11", product: "IMA203CD8", site: "Houston TX — Suite 100", criticality: "Minor", type: "Documentation — GDP", status: "Closed", owner: "M. Torres", daysOpen: 0 },
  { id: "DEV-2026-033", date: "Apr 09", product: "anzu-cel (IMA203)", site: "Tübingen DE", criticality: "Major", type: "Equipment Alarm — Incubator", status: "CAPA Pending", owner: "K. Müller", daysOpen: 8 },
  { id: "DEV-2026-031", date: "Apr 07", product: "anzu-cel (IMA203)", site: "Houston TX — Suite 100", criticality: "Critical", type: "Sterility Concern — Environmental", status: "Closed", owner: "J. Pinkhasov", daysOpen: 0 },
  { id: "DEV-2026-029", date: "Apr 05", product: "IMA402", site: "Munich DE", criticality: "Minor", type: "Label — Missing Lot Number", status: "Closed", owner: "A. Fischer", daysOpen: 0 },
  { id: "DEV-2026-027", date: "Apr 03", product: "anzu-cel (IMA203)", site: "Houston TX — Suite 100", criticality: "Major", type: "Process Deviation — Apheresis", status: "Closed", owner: "R. Horton", daysOpen: 0 },
  { id: "DEV-2026-024", date: "Mar 31", product: "IMA203CD8", site: "Houston TX — Suite 100", criticality: "Minor", type: "Documentation — SOP Version", status: "Closed", owner: "M. Torres", daysOpen: 0 },
  { id: "DEV-2026-022", date: "Mar 28", product: "anzu-cel (IMA203)", site: "Houston TX — Suite 100", criticality: "Major", type: "Equipment — BioReactor Alarm", status: "Closed", owner: "K. Chen", daysOpen: 0 },
  { id: "DEV-2026-019", date: "Mar 25", product: "anzu-cel (IMA203)", site: "Tübingen DE", criticality: "Critical", type: "Cold Chain — Shipment Excursion", status: "Closed", owner: "K. Müller", daysOpen: 0 },
];

const TREND = [
  { week: "Mar 17", critical: 0, major: 1, minor: 2 },
  { week: "Mar 24", critical: 1, major: 2, minor: 1 },
  { week: "Mar 31", critical: 0, major: 2, minor: 2 },
  { week: "Apr 07", critical: 1, major: 1, minor: 1 },
  { week: "Apr 14", critical: 1, major: 1, minor: 0 },
];

const critColor: Record<string, string> = {
  Critical: "#ef4444",
  Major: "#f59e0b",
  Minor: "#3b82f6",
};
const statusColor: Record<string, string> = {
  Open: "#ef4444",
  "Under Review": "#f59e0b",
  "CAPA Pending": "#a855f7",
  Closed: "#22c55e",
};

const maxTrend = 4;

export default function MetricsPage() {
  const [filter, setFilter] = useState<string>("All");

  const open = DEMO_DEVIATIONS.filter(d => d.status !== "Closed");
  const closed = DEMO_DEVIATIONS.filter(d => d.status === "Closed");
  const critCount = DEMO_DEVIATIONS.filter(d => d.criticality === "Critical").length;
  const majorCount = DEMO_DEVIATIONS.filter(d => d.criticality === "Major").length;
  const minorCount = DEMO_DEVIATIONS.filter(d => d.criticality === "Minor").length;
  const avgDaysOpen = Math.round(open.reduce((s, d) => s + d.daysOpen, 0) / (open.length || 1));
  const closureRate = Math.round((closed.length / DEMO_DEVIATIONS.length) * 100);

  const filtered = filter === "All" ? DEMO_DEVIATIONS : DEMO_DEVIATIONS.filter(d => d.criticality === filter || d.status === filter);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", color: "#e2e8f0", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e2a45", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>AgentNX</span>
            <span style={{ fontSize: 12, background: "#1e3a5f", color: "#60a5fa", padding: "2px 10px", borderRadius: 20, fontWeight: 600 }}>DEVIATION METRICS</span>
          </div>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>immatics US, Inc. · Houston TX · Live Demo Environment</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 11, color: "#22c55e", background: "#052e16", padding: "4px 12px", borderRadius: 20, fontWeight: 700 }}>● LIVE</span>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>Last sync: just now</span>
        </div>
      </div>

      <div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto" }}>
        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Total (30d)", value: DEMO_DEVIATIONS.length, color: "#e2e8f0", bg: "#1e2a45" },
            { label: "Critical", value: critCount, color: "#ef4444", bg: "#2d0a0a" },
            { label: "Major", value: majorCount, color: "#f59e0b", bg: "#2d1a00" },
            { label: "Minor", value: minorCount, color: "#3b82f6", bg: "#0a1a2d" },
            { label: "Open", value: open.length, color: "#a855f7", bg: "#1a0d2e" },
          ].map(k => (
            <div key={k.label} style={{ background: k.bg, border: `1px solid ${k.color}22`, borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Row 2 — Trend + Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, marginBottom: 28 }}>
          {/* Trend Chart */}
          <div style={{ background: "#111827", border: "1px solid #1e2a45", borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 20, textTransform: "uppercase", letterSpacing: 1 }}>Deviation Trend — Last 5 Weeks</div>
            <div style={{ display: "flex", gap: 24, alignItems: "flex-end", height: 120 }}>
              {TREND.map(w => (
                <div key={w.week} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
                    {[
                      { val: w.critical, color: "#ef4444" },
                      { val: w.major, color: "#f59e0b" },
                      { val: w.minor, color: "#3b82f6" },
                    ].map((b, i) => (
                      <div key={i} style={{
                        width: "100%",
                        height: `${(b.val / maxTrend) * 80}px`,
                        background: b.color,
                        borderRadius: 4,
                        opacity: b.val === 0 ? 0.15 : 0.85,
                        minHeight: b.val > 0 ? 8 : 0,
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 10, color: "#475569", marginTop: 6 }}>{w.week}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 16, paddingTop: 12, borderTop: "1px solid #1e2a45" }}>
              {[["Critical", "#ef4444"], ["Major", "#f59e0b"], ["Minor", "#3b82f6"]].map(([l, c]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#64748b" }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: c as string }} />
                  {l}
                </div>
              ))}
            </div>
          </div>

          {/* Stats Panel */}
          <div style={{ background: "#111827", border: "1px solid #1e2a45", borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>Performance</div>
            {[
              { label: "Closure Rate (30d)", value: `${closureRate}%`, color: "#22c55e" },
              { label: "Avg Days Open", value: `${avgDaysOpen}d`, color: "#f59e0b" },
              { label: "CAPA On-Time", value: "83%", color: "#22c55e" },
              { label: "Overdue (>14d)", value: "0", color: "#22c55e" },
              { label: "AI Intake Rate", value: "100%", color: "#60a5fa" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1e2a45" }}>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>{s.label}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}</span>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: "10px 14px", background: "#052e16", borderRadius: 8, border: "1px solid #14532d" }}>
              <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 700 }}>✓ BLA AUDIT READY</div>
              <div style={{ fontSize: 11, color: "#4ade80", marginTop: 2 }}>All records complete · No overdue CAPAs</div>
            </div>
          </div>
        </div>

        {/* Deviation Table */}
        <div style={{ background: "#111827", border: "1px solid #1e2a45", borderRadius: 12, padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>Recent Deviations</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["All", "Critical", "Major", "Minor", "Open", "Closed"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20, cursor: "pointer", border: "none",
                  background: filter === f ? "#1d4ed8" : "#1e2a45",
                  color: filter === f ? "#fff" : "#64748b",
                }}>{f}</button>
              ))}
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1e2a45" }}>
                  {["ID", "Date", "Product", "Site", "Type", "Criticality", "Status", "Owner", "Days Open"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#475569", fontWeight: 600, textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <tr key={d.id} style={{ borderBottom: "1px solid #0f172a", background: i % 2 === 0 ? "transparent" : "#0d1420" }}>
                    <td style={{ padding: "10px 12px", color: "#60a5fa", fontWeight: 600 }}>{d.id}</td>
                    <td style={{ padding: "10px 12px", color: "#94a3b8" }}>{d.date}</td>
                    <td style={{ padding: "10px 12px", color: "#e2e8f0" }}>{d.product}</td>
                    <td style={{ padding: "10px 12px", color: "#94a3b8" }}>{d.site.split("—")[0].trim()}</td>
                    <td style={{ padding: "10px 12px", color: "#cbd5e1" }}>{d.type}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: `${critColor[d.criticality]}22`, color: critColor[d.criticality] }}>
                        {d.criticality}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: `${statusColor[d.status]}22`, color: statusColor[d.status] }}>
                        {d.status}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#94a3b8" }}>{d.owner}</td>
                    <td style={{ padding: "10px 12px", color: d.daysOpen > 7 ? "#ef4444" : "#94a3b8", fontWeight: d.daysOpen > 7 ? 700 : 400 }}>
                      {d.status === "Closed" ? "—" : `${d.daysOpen}d`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 24, textAlign: "center", color: "#334155", fontSize: 11 }}>
          Powered by AgentNX.ai — AI Agents for Pharma Operations · For demonstration purposes only
        </div>
      </div>
    </div>
  );
}
