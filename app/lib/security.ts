import { NextRequest } from "next/server";

// ── Cloudflare Turnstile verification ─────────────────────────────────────────
export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn("TURNSTILE_SECRET_KEY not set — skipping verification");
    return true; // fail open in dev if key not configured
  }
  const params = new URLSearchParams({ secret, response: token });
  if (ip) params.set("remoteip", ip);
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }
    );
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

// ── HTML escaping ─────────────────────────────────────────────────────────────
// Escape user content before inserting into email HTML to prevent HTML injection.
export function escapeHtml(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// ── Prompt injection defense ──────────────────────────────────────────────────
// Strip patterns commonly used to hijack AI system prompts, then enforce a
// max length so a caller can't flood the context window.
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions?|prompts?|context)/gi,
  /forget\s+(all\s+)?(previous|prior|above|earlier)/gi,
  /you\s+are\s+now\s+/gi,
  /act\s+as\s+(a\s+)?(?!AgentNX)/gi,
  /pretend\s+(you\s+are|to\s+be)/gi,
  /new\s+instructions?\s*:/gi,
  /system\s*prompt/gi,
  /\bDAN\b/g,          // "Do Anything Now" jailbreak
  /<\|.*?\|>/g,        // special token delimiters used in some models
  /\[INST\]|\[\/INST\]/g,
  /###\s*instruction/gi,
];

export function sanitizeForPrompt(value: unknown, maxLen = 800): string {
  if (typeof value !== "string") return "";
  let out = value.slice(0, maxLen).trim();
  for (const pattern of INJECTION_PATTERNS) {
    out = out.replace(pattern, "[removed]");
  }
  return out;
}

// ── Safe filename ─────────────────────────────────────────────────────────────
// Used for Content-Disposition headers — strip anything that isn't safe in a
// filename to prevent HTTP header injection.
export function safeFilename(value: unknown): string {
  if (typeof value !== "string") return "report";
  return value.replace(/[^a-zA-Z0-9\-_.]/g, "_").slice(0, 80);
}

// ── Email validation ──────────────────────────────────────────────────────────
export function isValidEmail(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return (
    value.length <= 320 &&
    /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,63}$/.test(value)
  );
}

// ── String field validation ───────────────────────────────────────────────────
export function isNonEmptyString(value: unknown, maxLen = 2000): boolean {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLen;
}

// ── CSRF origin check ─────────────────────────────────────────────────────────
// Validates that POST requests originate from our own domain.
// Requests with no Origin header (server-to-server, curl) are allowed through
// so legitimate API integrations still work.
const ALLOWED_ORIGINS = ["https://agentnx.ai", "https://www.agentnx.ai"];

export function checkCsrfOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // no origin = not a browser cross-origin request
  if (process.env.NODE_ENV !== "production") return true; // skip in dev/preview
  return ALLOWED_ORIGINS.includes(origin);
}

// ── In-memory rate limiter ────────────────────────────────────────────────────
// Simple sliding-window limiter keyed by IP + route. Resets on server restart,
// which is acceptable for serverless — it prevents burst abuse per instance.
const rlMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rlMap.get(key);
  if (!entry || now > entry.resetAt) {
    rlMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"
  );
}
