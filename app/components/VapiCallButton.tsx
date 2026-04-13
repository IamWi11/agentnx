"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type CallStatus = "idle" | "connecting" | "active" | "ending";

interface AssistantConfig {
  systemPrompt: string;
  firstMessage: string;
}

interface VapiCallButtonProps {
  assistantId?: string;
  assistantConfig?: AssistantConfig;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export default function VapiCallButton({
  assistantId,
  assistantConfig,
  label = "Talk to Agent",
  size = "md",
}: VapiCallButtonProps) {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [volume, setVolume] = useState(0);
  const vapiRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  const startCall = async () => {
    setStatus("connecting");
    try {
      const { default: Vapi } = await import("@vapi-ai/web");
      const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);
      vapiRef.current = vapi;

      vapi.on("call-start", () => setStatus("active"));
      vapi.on("call-end", () => {
        setStatus("idle");
        setVolume(0);
        vapiRef.current = null;
      });
      vapi.on("volume-level", (v: number) => setVolume(v));
      vapi.on("error", () => setStatus("idle"));

      if (assistantId) {
        await vapi.start(assistantId);
      } else if (assistantConfig) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await vapi.start({
          model: {
            provider: "openai",
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: assistantConfig.systemPrompt }],
          },
          firstMessage: assistantConfig.firstMessage,
        } as any);
      }
    } catch {
      setStatus("idle");
    }
  };

  const stopCall = () => {
    setStatus("ending");
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const isActive = status === "active";
  const isConnecting = status === "connecting" || status === "ending";

  return (
    <div className="flex flex-col items-center gap-3">
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
        {/* Active glow based on volume */}
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
            style={{
              transform: `scale(${1 + volume * 1.5})`,
              transition: "transform 0.1s ease",
              opacity: 0.9,
            }}
          />
        )}
        {isConnecting && (
          <span className="w-3 h-3 rounded-full border-2 border-gray-400 border-t-transparent animate-spin flex-shrink-0" />
        )}
        {!isActive && !isConnecting && (
          <span className="text-base">🎙️</span>
        )}
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
    </div>
  );
}
