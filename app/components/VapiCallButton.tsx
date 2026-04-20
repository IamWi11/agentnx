"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type CallStatus = "idle" | "connecting" | "active" | "ending";

interface AssistantConfig {
  systemPrompt: string;
  firstMessage: string;
  voice?: { provider: string; voiceId: string; model?: string };
  model?: { provider: string; model: string };
}

interface VapiCallButtonProps {
  assistantId?: string;
  assistantConfig?: AssistantConfig;
  label?: string;
  size?: "sm" | "md" | "lg";
}

const NAV_ROUTES: Record<string, { path: string; label: string }> = {
  "mcp-demo": { path: "/mcp-demo?agent=1", label: "Open Live Demo" },
  "voice":    { path: "/voice?agent=1",    label: "Open Voice Demos" },
};

const PLANS = [
  { id: "pilot",      name: "Pilot",      price: "$499",  period: "/mo", calls: "< 200 calls/day",       cta: "Get Started" },
  { id: "starter",    name: "Starter",    price: "$999",  period: "/mo", calls: "200–500 calls/day",     cta: "Get Started" },
  { id: "growth",     name: "Growth",     price: "$2,499",period: "/mo", calls: "500–1,000 calls/day",   cta: "Get Started" },
  { id: "enterprise", name: "Enterprise", price: "Custom",period: "",    calls: "1,000+ calls/day",      cta: "Contact Us"  },
];

export default function VapiCallButton({
  assistantId,
  assistantConfig,
  label = "Talk to Agent",
  size = "md",
}: VapiCallButtonProps) {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [volume, setVolume] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [navPrompt, setNavPrompt] = useState<{ path: string; label: string } | null>(null);
  const [recommendedPlan, setRecommendedPlan] = useState<string | null>(null);
  const vapiRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (vapiRef.current) vapiRef.current.stop();
    };
  }, []);

  const sendToolResult = (vapi: any, tcId: string, name: string, content: string) => {
    try {
      vapi.send({
        type: "add-message",
        message: { role: "tool", tool_call_id: tcId, name, content },
      });
    } catch { /* non-fatal */ }
  };

  const handleToolCall = (tc: any, vapi: any) => {
    const name: string = tc?.function?.name ?? tc?.name ?? "";
    const raw = tc?.function?.arguments ?? tc?.arguments ?? "{}";
    const args = typeof raw === "string" ? JSON.parse(raw) : raw;
    const tcId: string = tc?.id ?? tc?.functionCallId ?? "";

    if (name === "navigate_to_page") {
      const route = NAV_ROUTES[args.page];
      if (route) {
        setNavPrompt(route);
        const opened = window.open(route.path, "_blank", "noopener");
        sendToolResult(vapi, tcId, name, opened ? `Opened ${route.path} in new tab.` : "Navigation button shown.");
      }
    }

    if (name === "show_pricing") {
      setRecommendedPlan(args.recommended_plan ?? null);
      sendToolResult(vapi, tcId, name, "Pricing displayed on screen.");
    }
  };

  const startCall = async () => {
    setStatus("connecting");
    setErrorMsg(null);
    setNavPrompt(null);
    setRecommendedPlan(null);
    try {
      const { default: Vapi } = await import("@vapi-ai/web");
      const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!, undefined, {
        experimentalChromeVideoMuteLightOff: true,
      } as any);
      vapiRef.current = vapi;

      vapi.on("call-start", () => {
        setStatus("active");
        if (vapi.isMuted()) vapi.setMuted(false);
      });
      vapi.on("call-start-progress" as any, (s: any) => console.log("[VAPI progress]", JSON.stringify(s)));
      vapi.on("call-end", () => {
        setStatus("idle");
        setVolume(0);
        setNavPrompt(null);
        vapiRef.current = null;
      });
      vapi.on("volume-level", (v: number) => setVolume(v));

      vapi.on("message", (msg: any) => {
        if (msg?.type !== "transcript") {
          console.log("[VAPI msg]", msg?.type, JSON.stringify(msg).slice(0, 200));
        }

        // Tool call events (navigate_to_page)
        if (msg?.type === "tool-calls" && Array.isArray(msg.toolCallList)) {
          for (const tc of msg.toolCallList) handleToolCall(tc, vapi);
        } else if (msg?.type === "function-call") {
          handleToolCall(msg, vapi);
        }

        // Transcript-based pricing trigger — fires reliably every time
        if (msg?.role === "assistant" && msg?.transcriptType === "final") {
          const text: string = (msg?.transcript ?? "").toLowerCase();
          if (text.includes("i recommend the")) {
            if (text.includes("pilot"))      setRecommendedPlan("pilot");
            else if (text.includes("starter"))    setRecommendedPlan("starter");
            else if (text.includes("growth"))     setRecommendedPlan("growth");
            else if (text.includes("enterprise")) setRecommendedPlan("enterprise");
          }
        }
      });

      vapi.on("error", (e: unknown) => {
        console.error("[VAPI error]", e);
        setStatus("idle");
        const isNormalEnd =
          typeof e === "object" && e !== null &&
          (e as any)?.error?.message?.type === "ejected";
        if (!isNormalEnd) {
          const msg = typeof e === "object" && e !== null
            ? ((e as any)?.error?.message || (e as any)?.errorMsg || (e as any)?.message || JSON.stringify(e))
            : String(e);
          setErrorMsg(String(msg));
        }
      });

      const timeout = setTimeout(() => {
        if (vapiRef.current) vapiRef.current.stop();
        setStatus("idle");
        setErrorMsg("Connection timed out — try again or check mic permissions");
      }, 15000);
      vapi.on("call-start", () => clearTimeout(timeout));
      vapi.on("call-end", () => clearTimeout(timeout));

      if (assistantId) {
        await vapi.start(assistantId);
      } else if (assistantConfig) {
        const modelCfg = assistantConfig.model ?? { provider: "anthropic", model: "claude-sonnet-4-20250514" };
        const voiceCfg = assistantConfig.voice ?? { provider: "openai", voiceId: "nova", model: "tts-1" };
        await vapi.start({
          model: {
            provider: modelCfg.provider,
            model: modelCfg.model,
            messages: [{ role: "system", content: assistantConfig.systemPrompt }],
          },
          voice: voiceCfg,
          firstMessage: assistantConfig.firstMessage,
        } as any);
      }
    } catch (e: unknown) {
      console.error("[VAPI catch]", e);
      setStatus("idle");
      setErrorMsg(e instanceof Error ? e.message : String(e));
    }
  };

  const stopCall = () => {
    setStatus("ending");
    if (vapiRef.current) vapiRef.current.stop();
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const isActive = status === "active";
  const isConnecting = status === "connecting" || status === "ending";

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl">
      <div className="relative">
        {/* Idle pulse rings */}
        {!isActive && !isConnecting && (
          <>
            <motion.span
              animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-blue-500/40 pointer-events-none"
            />
            <motion.span
              animate={{ scale: [1, 2.2], opacity: [0.25, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
              className="absolute inset-0 rounded-full bg-blue-500/20 pointer-events-none"
            />
          </>
        )}
        {isActive && (
          <motion.span
            animate={{ scale: 1 + volume * 0.5, opacity: 0.4 + volume * 0.3 }}
            transition={{ duration: 0.1 }}
            className="absolute inset-0 rounded-full bg-red-500/50 blur-md pointer-events-none"
          />
        )}
        <button
          onClick={isActive ? stopCall : startCall}
          disabled={isConnecting}
          className={`
            relative flex items-center gap-2 font-semibold rounded-full transition-all
            ${sizeClasses[size]}
            ${isActive
              ? "bg-red-500 hover:bg-red-400 text-white"
              : isConnecting
              ? "bg-white/10 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-400 text-white"
            }
          `}
        >
          {isActive && (
            <span
              className="w-3 h-3 rounded-full bg-white flex-shrink-0"
              style={{ transform: `scale(${1 + volume * 1.5})`, transition: "transform 0.1s ease", opacity: 0.9 }}
            />
          )}
          {isConnecting && (
            <span className="w-3 h-3 rounded-full border-2 border-gray-400 border-t-transparent animate-spin flex-shrink-0" />
          )}
          {!isActive && !isConnecting && <span className="text-base">🎙️</span>}
          {status === "idle" && label}
          {status === "connecting" && "Connecting..."}
          {status === "active" && "End Call"}
          {status === "ending" && "Ending..."}
        </button>
      </div>

      {isActive && (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-blue-400 transition-all duration-100"
              style={{
                height: `${8 + Math.max(0, (volume - i * 0.15) * 40)}px`,
                opacity: volume > i * 0.15 ? 1 : 0.2,
              }}
            />
          ))}
          <span className="text-xs text-gray-400 ml-2">Live</span>
        </div>
      )}

      {/* Nav button (demo/voice) */}
      {navPrompt && (
        <motion.a
          href={navPrompt.path}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-sm font-medium hover:bg-blue-500/30 transition-all"
        >
          <span>↗</span>
          {navPrompt.label}
        </motion.a>
      )}

      {/* Inline pricing card — shown after Alex vets and recommends a plan */}
      <AnimatePresence>
        {recommendedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <p className="text-xs text-gray-500 text-center mb-3 uppercase tracking-widest">Recommended for you</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {PLANS.map((plan) => {
                const isRec = plan.id === recommendedPlan;
                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-xl p-4 flex flex-col gap-1 border transition-all ${
                      isRec
                        ? "bg-blue-500/15 border-blue-500/60 ring-1 ring-blue-500/40"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    {isRec && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest bg-blue-500 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                        Best fit
                      </span>
                    )}
                    <span className={`text-sm font-bold ${isRec ? "text-white" : "text-gray-300"}`}>{plan.name}</span>
                    <span className={`text-xl font-extrabold ${isRec ? "text-blue-300" : "text-gray-400"}`}>
                      {plan.price}<span className="text-xs font-normal text-gray-500">{plan.period}</span>
                    </span>
                    <span className="text-[11px] text-gray-500 leading-tight">{plan.calls}</span>
                    <a
                      href="/pricing?agent=1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-2 text-center text-xs font-semibold py-1.5 rounded-lg transition-all ${
                        isRec
                          ? "bg-blue-500 hover:bg-blue-400 text-white"
                          : "bg-white/10 hover:bg-white/20 text-gray-300"
                      }`}
                    >
                      {plan.cta}
                    </a>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {errorMsg && (
        <p className="text-xs text-red-400 max-w-xs text-center">{errorMsg}</p>
      )}
    </div>
  );
}
