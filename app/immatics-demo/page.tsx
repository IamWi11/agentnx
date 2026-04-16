"use client";

import { useState, useRef, useEffect } from "react";

type Step = "form" | "analyzing" | "result";

interface DeviationResult {
  deviationId: string;
  isDeviation: boolean;
  deviationRationale: string;
  criticality: string;
  criticalityRationale: string;
  deviationTitle: string;
  rootCauseCategory: string;
  department: string;
  product: string;
  batchNumber: string;
  location: string;
  description: string;
  immediateActions: string;
  ownerName: string;
  ownerTitle: string;
  oqaApprover: string;
  teamsMessage: string;
  emailSubject: string;
  emailBody: string;
  dateCreated: string;
  timeCreated: string;
  status: string;
}

const ANALYSIS_STEPS = [
  "Receiving event from notifying department...",
  "Applying Deviation Decision Tree (SOP-QA-001)...",
  "Checking against GMP regulatory requirements...",
  "Assessing product quality and patient safety impact...",
  "Determining criticality classification...",
  "Identifying root cause category...",
  "Assigning owner from owning department...",
  "Selecting OQA approver...",
  "Pre-populating Veeva Vault record...",
  "Drafting Teams & Outlook notifications...",
  "Creating deviation record in Vault...",
];

const LOCATIONS = [
  "Suite 100 — Cell Therapy Suite A",
  "Suite 100 — Cell Therapy Suite B",
  "Suite 100 — Cell Therapy Suite C",
  "Suite 100 — QC Laboratory",
  "Suite 100 — Engineering / Maintenance Room",
  "Suite 100 — Formulation Suite",
  "Suite 100 — Warehouse / Cold Storage",
  "Suite 100 — Corridor / Common Area",
];

const PRODUCTS = [
  "anzu-cel (IMA203)",
  "IMA203CD8",
  "IMA402",
  "IMA401",
];

type ChatMessage = { role: "user" | "assistant"; content: string };

const CRITICALITY_COLORS: Record<string, string> = {
  Critical: "bg-red-500/20 border-red-500/40 text-red-400",
  Major:    "bg-orange-500/20 border-orange-500/40 text-orange-400",
  Minor:    "bg-yellow-500/20 border-yellow-500/40 text-yellow-400",
  "N/A":    "bg-gray-500/20 border-gray-500/40 text-gray-400",
};

export default function ImmaticsDemo() {
  const [step, setStep] = useState<Step>("form");
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<DeviationResult | null>(null);
  const [activeTab, setActiveTab] = useState<"veeva" | "teams" | "email">("veeva");
  const [recordingField, setRecordingField] = useState<"description" | "immediateActions" | null>(null);
  const [guidedOpen, setGuidedOpen] = useState(false);
  const [vapiStatus, setVapiStatus] = useState<"idle" | "connecting" | "active" | "analyzing">("idle");
  const [vapiVolume, setVapiVolume] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatReady, setChatReady] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vapiRef = useRef<any>(null);
  const chatMessagesRef = useRef<ChatMessage[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const [form, setForm] = useState({
    description: "",
    department: "Cell Therapy Manufacturing",
    product: "",
    batchNumber: "",
    location: "Suite 100 — Cell Therapy Suite A",
    immediateActions: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const startRecording = (field: "description" | "immediateActions") => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Voice recording requires Chrome or Safari."); return; }

    // Toggle off if already recording this field
    if (recordingField === field) {
      recognitionRef.current?.stop();
      setRecordingField(null);
      return;
    }

    // Stop any active recording first
    recognitionRef.current?.stop();

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    let finalText = form[field] ? form[field] + " " : "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript + " ";
        } else {
          interim = event.results[i][0].transcript;
        }
      }
      setForm(f => ({ ...f, [field]: (finalText + interim).trimStart() }));
    };

    rec.onend = () => {
      setRecordingField(null);
      setForm(f => ({ ...f, [field]: finalText.trim() }));
    };

    rec.onerror = () => { setRecordingField(null); };

    recognitionRef.current = rec;
    rec.start();
    setRecordingField(field);
  };

  const openGuidedInterview = async () => {
    chatMessagesRef.current = [];
    setChatMessages([]);
    setVapiVolume(0);
    setChatReady(false);
    setVapiStatus("connecting");
    setGuidedOpen(true);
    try {
      const { default: Vapi } = await import("@vapi-ai/web");
      const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);
      vapiRef.current = vapi;

      vapi.on("call-start", () => setVapiStatus("active"));
      vapi.on("volume-level", (v: number) => setVapiVolume(v));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vapi.on("message", (msg: any) => {
        if (msg.type === "transcript" && msg.transcriptType === "final") {
          const entry: ChatMessage = {
            role: msg.role === "assistant" ? "assistant" : "user",
            content: msg.transcript,
          };
          chatMessagesRef.current = [...chatMessagesRef.current, entry];
          setChatMessages([...chatMessagesRef.current]);
          if (msg.role === "assistant" && msg.transcript.toLowerCase().includes("save to form")) {
            setChatReady(true);
          }
        }
      });

      vapi.on("call-end", async () => {
        setVapiStatus("analyzing");
        setVapiVolume(0);
        const msgs = chatMessagesRef.current;
        if (msgs.length > 0) {
          try {
            const res = await fetch("/api/immatics-transcript", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ messages: msgs.map(m => ({ role: m.role, text: m.content })) }),
            });
            if (res.ok) {
              const { description } = await res.json();
              if (description) setForm(f => ({ ...f, description }));
            }
          } catch { /* ignore */ }
        }
        setGuidedOpen(false);
        setVapiStatus("idle");
        vapiRef.current = null;
      });

      let errShown = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vapi.on("error", (e: any) => {
        console.error("VAPI error:", e);
        if (errShown) return;
        errShown = true;
        const errMsg: ChatMessage = { role: "assistant", content: "⚠ Could not connect. Make sure microphone access is allowed, then close and try again." };
        chatMessagesRef.current = [errMsg];
        setChatMessages([errMsg]);
        setVapiStatus("idle");
      });

      // Get a properly registered assistant ID (avoids inline config issues)
      const assistantRes = await fetch("/api/immatics-vapi-assistant", { method: "POST" });
      const { assistantId, error: assistantErr } = await assistantRes.json();
      if (!assistantId) throw new Error(assistantErr || "No assistant ID returned");
      await vapi.start(assistantId);
    } catch (err) {
      console.error("Failed to start VAPI:", err);
      const errMsg: ChatMessage = { role: "assistant", content: "⚠ Could not connect. Check your microphone permissions and try again." };
      chatMessagesRef.current = [errMsg];
      setChatMessages([errMsg]);
      setVapiStatus("idle");
    }
  };

  const stopVapiCall = () => vapiRef.current?.stop();

  const closeGuided = () => {
    vapiRef.current?.stop();
    setGuidedOpen(false);
    setVapiStatus("idle");
    vapiRef.current = null;
  };

  const saveChatToForm = async () => {
    vapiRef.current?.stop();
    setVapiStatus("analyzing");
    try {
      const res = await fetch("/api/immatics-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatMessagesRef.current.map(m => ({ role: m.role, text: m.content })) }),
      });
      if (res.ok) {
        const { description } = await res.json();
        if (description) setForm(f => ({ ...f, description }));
      }
    } catch { /* ignore */ }
    setGuidedOpen(false);
    setVapiStatus("idle");
    vapiRef.current = null;
  };

  // Auto-scroll transcript to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("analyzing");
    setAnalysisStep(0);

    // Animate through analysis steps
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 600));
      setAnalysisStep(i + 1);
    }

    try {
      const res = await fetch("/api/immatics-deviation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setStep("result");
      } else {
        alert(data.error || "Agent processing failed. Please try again.");
        setStep("form");
      }
    } catch {
      alert("Network error. Please try again.");
      setStep("form");
    }
  };

  const fillExample = () => {
    setForm({
      description: "During the cell expansion phase for patient batch IMA203-2026-047, the incubator temperature alarm triggered at 02:14. Temperature recorded at 33.2°C instead of the specified 37°C ± 0.5°C. Alarm was active for approximately 22 minutes before operator response. The batch is currently at Day 6 of 14-day expansion.",
      department: "Cell Therapy Manufacturing",
      product: "anzu-cel (IMA203)",
      batchNumber: "IMA203-2026-047",
      location: "Suite 100 — Cell Therapy Suite B",
      immediateActions: "Incubator temperature restored to 37°C. Batch quarantined pending QA assessment. Maintenance notified to inspect incubator calibration. Patient care team notified of potential delay.",
    });
  };

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <a href="/" className="text-xl font-bold tracking-tight">
          Agent<span className="text-blue-400">NX</span>
          <span className="text-blue-400">.ai</span>
        </a>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">Deviation Front Gate</span>
          <span className="bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full">
            immatics Demo
          </span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            AgentNX × Veeva Vault — Deviation Front Gate
          </div>
          <h1 className="text-4xl font-extrabold mb-3">
            Deviation <span className="text-blue-400">Workflow Agent</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Department submits an event. The agent applies your Deviation Decision Tree and SOPs, classifies the event,
            pre-populates the Veeva record, assigns owner + OQA approver, and sends Teams/Outlook notifications.
            No email chain required.
          </p>
        </div>

        {/* Workflow diagram */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
          {[
            { label: "Event Occurs", icon: "⚡" },
            { label: "Agent Classifies", icon: "🤖" },
            { label: "Veeva Created", icon: "📋" },
            { label: "Owner Assigned", icon: "👤" },
            { label: "Notified", icon: "🔔" },
          ].map((s, i) => (
            <div key={s.label} className="flex items-center gap-2 flex-shrink-0">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-lg">
                  {s.icon}
                </div>
                <span className="text-xs text-gray-400 mt-1 text-center whitespace-nowrap">{s.label}</span>
              </div>
              {i < 4 && <div className="text-blue-400/40 text-xl mb-4">→</div>}
            </div>
          ))}
        </div>

        {/* STEP 1: FORM */}
        {step === "form" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Event Report — Notifying Department</h2>
              <button
                onClick={fillExample}
                className="text-xs text-blue-400 border border-blue-400/30 hover:border-blue-400 px-3 py-1.5 rounded-full transition"
              >
                Load Example Event →
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-300">Reporting Department</label>
                  <select name="department" value={form.department} onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400">
                    <option>Cell Therapy Manufacturing</option>
                    <option>Quality Control Lab</option>
                    <option>Engineering</option>
                    <option>Facilities</option>
                    <option>Supply Chain</option>
                    <option>Regulatory Affairs</option>
                    <option>Clinical Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-300">Location</label>
                  <select name="location" value={form.location} onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400">
                    {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-300">Product</label>
                  <select name="product" value={form.product} onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400">
                    <option value="">— Select product —</option>
                    {PRODUCTS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-300">Batch Number</label>
                  <input name="batchNumber" value={form.batchNumber} onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="e.g. IMA203-2026-047" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-300">Event Description</label>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={openGuidedInterview}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition">
                      <span>📋</span> Guided Interview
                    </button>
                    <button type="button" onClick={() => startRecording("description")}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border transition ${
                        recordingField === "description"
                          ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse"
                          : "bg-white/5 border-white/20 text-gray-400 hover:text-white hover:border-white/40"
                      }`}>
                      <span>{recordingField === "description" ? "⏹" : "🎙️"}</span>
                      {recordingField === "description" ? "Stop" : "Dictate"}
                    </button>
                  </div>
                </div>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={5}
                  className={`w-full bg-white/10 border rounded-lg px-4 py-2.5 text-sm focus:outline-none resize-none transition ${
                    recordingField === "description"
                      ? "border-red-500/50 focus:border-red-400"
                      : "border-white/20 focus:border-blue-400"
                  }`}
                  placeholder="Describe what happened, when it was discovered, and what was observed — or use Guided Interview to answer step-by-step." />
                {recordingField === "description" && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Listening — speak clearly. Click Stop when done.
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-300">Immediate Actions Taken</label>
                  <button type="button" onClick={() => startRecording("immediateActions")}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border transition ${
                      recordingField === "immediateActions"
                        ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse"
                        : "bg-white/5 border-white/20 text-gray-400 hover:text-white hover:border-white/40"
                    }`}>
                    <span>{recordingField === "immediateActions" ? "⏹" : "🎙️"}</span>
                    {recordingField === "immediateActions" ? "Stop Recording" : "Voice Record"}
                  </button>
                </div>
                <textarea name="immediateActions" value={form.immediateActions} onChange={handleChange} rows={3}
                  className={`w-full bg-white/10 border rounded-lg px-4 py-2.5 text-sm focus:outline-none resize-none transition ${
                    recordingField === "immediateActions"
                      ? "border-red-500/50 focus:border-red-400"
                      : "border-white/20 focus:border-blue-400"
                  }`}
                  placeholder="Actions taken immediately after discovery — or click Voice Record to speak it." />
                {recordingField === "immediateActions" && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Listening — speak clearly. Click Stop Recording when done.
                  </p>
                )}
              </div>

              <button type="submit"
                className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 rounded-xl text-base transition flex items-center justify-center gap-2">
                <span>🤖</span> Submit to Agent — Apply Decision Tree →
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: ANALYZING */}
        {step === "analyzing" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
            <div className="text-5xl mb-6 animate-pulse">🤖</div>
            <h2 className="text-2xl font-bold mb-2">Agent Working</h2>
            <p className="text-gray-400 mb-8 text-sm">Applying Deviation Decision Tree and GMP SOPs...</p>

            <div className="max-w-md mx-auto space-y-3 text-left">
              {ANALYSIS_STEPS.map((s, i) => (
                <div key={s} className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                  i < analysisStep ? "opacity-100" : "opacity-20"
                }`}>
                  <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    i < analysisStep ? "bg-blue-500 text-white" : "bg-white/10 text-gray-500"
                  }`}>
                    {i < analysisStep ? "✓" : "○"}
                  </span>
                  <span className={i < analysisStep ? "text-white" : "text-gray-500"}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: RESULT */}
        {step === "result" && result && (
          <div className="space-y-6">

            {/* Classification Banner */}
            <div className={`rounded-2xl p-6 border ${
              result.isDeviation
                ? "bg-red-500/10 border-red-500/30"
                : "bg-green-500/10 border-green-500/30"
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest mb-1 text-gray-400">
                    Agent Classification — {result.dateCreated} at {result.timeCreated}
                  </div>
                  <div className={`text-2xl font-extrabold mb-1 ${result.isDeviation ? "text-red-400" : "text-green-400"}`}>
                    {result.isDeviation ? "⚠  DEVIATION CONFIRMED" : "✓  NOT A DEVIATION"}
                  </div>
                  <p className="text-gray-300 text-sm">{result.deviationRationale}</p>
                </div>
                {result.isDeviation && (
                  <div className={`flex-shrink-0 ml-6 px-4 py-2 rounded-xl border text-sm font-bold ${CRITICALITY_COLORS[result.criticality] ?? CRITICALITY_COLORS["Minor"]}`}>
                    {result.criticality} Criticality
                  </div>
                )}
              </div>
              {result.isDeviation && (
                <p className="text-gray-400 text-xs mt-3">{result.criticalityRationale}</p>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10 pb-0">
              {(["veeva", "teams", "email"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition border-b-2 ${
                    activeTab === tab
                      ? "border-blue-500 text-white bg-blue-500/10"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}>
                  {tab === "veeva" && "📋 Veeva Record"}
                  {tab === "teams" && "💬 Teams Notification"}
                  {tab === "email" && "📧 Outlook Notification"}
                </button>
              ))}
            </div>

            {/* Veeva Record */}
            {activeTab === "veeva" && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-lg">Pre-populated Veeva Vault Record</h3>
                  <span className="text-xs bg-blue-500/20 border border-blue-500/30 text-blue-400 px-3 py-1 rounded-full font-semibold">
                    Auto-Created by Agent
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { label: "Deviation ID", value: result.deviationId, highlight: true },
                    { label: "Status", value: result.status },
                    { label: "Title", value: result.deviationTitle, full: true },
                    { label: "Criticality", value: result.criticality },
                    { label: "Root Cause Category", value: result.rootCauseCategory },
                    { label: "Owning Department", value: result.department },
                    { label: "Assigned Owner", value: `${result.ownerName} — ${result.ownerTitle}` },
                    { label: "OQA Approver", value: result.oqaApprover },
                    { label: "Product", value: result.product || "—" },
                    { label: "Batch Number", value: result.batchNumber || "—" },
                    { label: "Location", value: result.location },
                    { label: "Date Initiated", value: result.dateCreated },
                  ].map(({ label, value, highlight, full }) => (
                    <div key={label} className={`bg-white/5 border border-white/10 rounded-xl p-4 ${full ? "md:col-span-2" : ""}`}>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</div>
                      <div className={`text-sm font-semibold ${highlight ? "text-blue-400 text-base" : "text-white"}`}>{value}</div>
                    </div>
                  ))}
                  <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Event Description (pre-filled)</div>
                    <div className="text-sm text-gray-300 leading-relaxed">{result.description}</div>
                  </div>
                  {result.immediateActions && (
                    <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Immediate Actions Taken</div>
                      <div className="text-sm text-gray-300 leading-relaxed">{result.immediateActions}</div>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-xs text-green-400">
                  ✓ Record created in Veeva Vault QMS · Owner notified via Teams · OQA approver notified via Outlook · Email chain eliminated
                </div>
              </div>
            )}

            {/* Teams Notification */}
            {activeTab === "teams" && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-1">Teams Notification — Sent to Owner</h3>
                <p className="text-gray-400 text-sm mb-5">
                  Sent automatically to <span className="text-white">{result.ownerName}</span> ({result.ownerTitle}) upon deviation creation.
                </p>

                <div className="bg-[#1a1d2e] border border-white/10 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">A</div>
                    <div>
                      <div className="text-sm font-semibold">AgentNX Bot</div>
                      <div className="text-xs text-gray-400">Today at {result.timeCreated}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">{result.teamsMessage}</div>
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded font-semibold">
                      {result.deviationId}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  No email chain required. Owner receives this notification directly in Teams and can respond within Veeva Vault.
                </p>
              </div>
            )}

            {/* Outlook Email */}
            {activeTab === "email" && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-1">Outlook Notification — OQA Approver</h3>
                <p className="text-gray-400 text-sm mb-5">
                  Sent automatically to <span className="text-white">{result.oqaApprover}</span> for review and approval assignment.
                </p>

                <div className="bg-[#1a1d2e] border border-white/10 rounded-xl overflow-hidden">
                  <div className="border-b border-white/10 p-4 space-y-1">
                    <div className="text-xs text-gray-400"><span className="text-gray-500 w-16 inline-block">From:</span> AgentNX Deviation System &lt;deviations@agentnx.ai&gt;</div>
                    <div className="text-xs text-gray-400"><span className="text-gray-500 w-16 inline-block">To:</span> {result.oqaApprover}</div>
                    <div className="text-xs text-gray-400"><span className="text-gray-500 w-16 inline-block">Subject:</span> <span className="text-white">{result.emailSubject}</span></div>
                  </div>
                  <div className="p-5 text-sm text-gray-200 leading-relaxed whitespace-pre-line">{result.emailBody}</div>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  OQA approver reviews in Veeva Vault and approves or rejects — no manual email chain coordination needed.
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Ready to build this for immatics?</h3>
              <p className="text-gray-400 text-sm mb-4">
                This demo uses your actual workflow. A 60-day pilot configures the agent to your Deviation Decision Tree and SOPs,
                connects to your Veeva Vault, and replaces the email chain entirely.
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                <a href="mailto:william@agentnx.ai?subject=immatics AgentNX Pilot"
                  className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition">
                  Start the Pilot →
                </a>
                <button onClick={() => { setStep("form"); setResult(null); setRecordingField(null); recognitionRef.current?.stop(); setForm({ description: "", department: "Cell Therapy Manufacturing", product: "", batchNumber: "", location: "Suite 100 — Cell Therapy Suite A", immediateActions: "" }); }}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition">
                  Run Another Event
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ── Alex Voice Interview Modal ───────────────────────────────────────── */}
      {guidedOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center px-4">
          <div className="bg-[#0f1420] border border-white/15 rounded-2xl flex flex-col max-w-lg w-full shadow-2xl"
            style={{ maxHeight: "88vh" }}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  vapiStatus === "active" ? "bg-green-400 animate-pulse" :
                  vapiStatus === "connecting" ? "bg-yellow-400 animate-pulse" :
                  vapiStatus === "analyzing" ? "bg-blue-400 animate-pulse" : "bg-gray-500"
                }`} />
                <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">A</div>
                <div>
                  <div className="text-sm font-bold text-white leading-none">Alex</div>
                  <div className="text-xs text-gray-500">
                    {vapiStatus === "connecting" && "Connecting…"}
                    {vapiStatus === "active" && "Live — speak freely"}
                    {vapiStatus === "analyzing" && "Compiling report…"}
                    {vapiStatus === "idle" && "Deviation Intake Agent"}
                  </div>
                </div>
              </div>
              <button onClick={closeGuided}
                className="text-gray-500 hover:text-white transition text-lg leading-none px-1">✕</button>
            </div>

            {/* Connecting spinner */}
            {vapiStatus === "connecting" && (
              <div className="flex flex-col items-center py-10 gap-4 flex-1">
                <div className="w-10 h-10 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                <p className="text-sm text-gray-400">Starting your AI intake agent…</p>
                <p className="text-xs text-gray-600">Allow microphone access when prompted</p>
              </div>
            )}

            {/* Analyzing spinner */}
            {vapiStatus === "analyzing" && (
              <div className="flex flex-col items-center py-10 gap-4 flex-1">
                <div className="w-10 h-10 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                <p className="text-sm text-gray-400">Extracting deviation details…</p>
              </div>
            )}

            {/* Live transcript */}
            {(vapiStatus === "active" || vapiStatus === "idle") && (
              <>
                {/* Volume bars */}
                {vapiStatus === "active" && (
                  <div className="flex items-end justify-center gap-1 pt-4 h-12 flex-shrink-0">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="w-1.5 rounded-full bg-blue-400 transition-all duration-75"
                        style={{
                          height: `${10 + Math.max(0, (vapiVolume - i * 0.1) * 52)}px`,
                          opacity: vapiVolume > i * 0.1 ? 1 : 0.12,
                        }} />
                    ))}
                  </div>
                )}

                <div ref={chatScrollRef}
                  className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-0">
                  {chatMessages.length === 0 && vapiStatus === "active" && (
                    <p className="text-center text-gray-600 text-xs pt-4 italic">Alex is about to speak…</p>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex gap-2 text-sm ${msg.role === "user" ? "justify-end" : ""}`}>
                      {msg.role === "assistant" && (
                        <div className="w-6 h-6 rounded-full bg-blue-500/80 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">A</div>
                      )}
                      <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 leading-snug text-sm ${
                        msg.role === "assistant"
                          ? "bg-white/8 text-gray-200 rounded-tl-sm"
                          : "bg-blue-500/25 text-blue-100 rounded-tr-sm"
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom controls */}
                <div className="px-5 pb-5 pt-3 border-t border-white/10 flex-shrink-0 space-y-2">
                  {vapiStatus === "active" && (
                    <button onClick={stopVapiCall}
                      className="w-full py-2.5 rounded-xl text-sm font-bold bg-red-500/15 border border-red-500/35 text-red-400 hover:bg-red-500/25 transition">
                      End Interview
                    </button>
                  )}
                  {chatReady && (
                    <button onClick={saveChatToForm}
                      className="w-full py-2.5 rounded-xl text-sm font-bold bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30 transition">
                      Save to Form ✓
                    </button>
                  )}
                  {!chatReady && chatMessages.length >= 2 && vapiStatus === "idle" && (
                    <button onClick={saveChatToForm}
                      className="w-full text-xs text-gray-500 hover:text-gray-300 transition py-1">
                      Done talking — save to form
                    </button>
                  )}
                </div>
              </>
            )}

          </div>
        </div>
      )}

      <footer className="border-t border-white/10 px-8 py-6 text-center text-gray-600 text-sm mt-10">
        © 2026 AgentNX.ai — AI Agents for Pharma Quality Operations
        <span className="mx-3">·</span>
        <span>A product of IMAGE 101 LLC · Service-Disabled Veteran-Owned Small Business</span>
      </footer>
    </main>
  );
}
