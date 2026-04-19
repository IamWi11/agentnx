import type { NextConfig } from "next";

const securityHeaders = [
  // Force HTTPS for 2 years — browsers will never attempt HTTP again
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Prevent the site from being embedded in iframes (clickjacking protection)
  { key: "X-Frame-Options", value: "DENY" },
  // Stop browsers from MIME-sniffing responses away from declared content-type
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Only send origin in referrer header for cross-origin requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable browser features not needed by this site
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), interest-cohort=()" },
  // Legacy XSS filter for older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: self + Vercel analytics/speed insights
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://cdn.vercel-insights.com https://challenges.cloudflare.com https://*.clerk.accounts.dev",
      // Styles: unsafe-inline required for framer-motion and Tailwind
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Images: self, data URIs, and any HTTPS source
      "img-src 'self' data: https:",
      // Fonts: self and Google Fonts CDN
      "font-src 'self' https://fonts.gstatic.com",
      // API connections: self + VAPI + Vercel telemetry + Stripe + Cloudflare Turnstile
      "connect-src 'self' https://api.vapi.ai wss://*.vapi.ai https://vitals.vercel-insights.com https://va.vercel-scripts.com https://api.stripe.com https://challenges.cloudflare.com",
      // Media (microphone access for VAPI voice)
      "media-src 'self' blob:",
      // Cloudflare Turnstile iframe
      "frame-src https://challenges.cloudflare.com",
      // No third-party framing of this site
      "frame-ancestors 'none'",
      // Only allow forms to submit to our own origin
      "form-action 'self'",
      // Prevent base tag hijacking
      "base-uri 'self'",
    ].join("; "),
  },
];

// Restrict CORS on API routes — overrides Vercel's platform-level wildcard default.
// Only requests from our own domain get the Access-Control-Allow-Origin grant.
// Server-to-server calls (no Origin header) pass through unaffected.
const corsHeaders = [
  { key: "Access-Control-Allow-Origin", value: "https://www.agentnx.ai" },
  { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
  { key: "Access-Control-Allow-Headers", value: "Content-Type" },
  { key: "Access-Control-Max-Age", value: "86400" },
];

const nextConfig: NextConfig = {
  serverExternalPackages: ["groq-sdk", "resend"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Apply restrictive CORS explicitly to all API routes
        source: "/api/(.*)",
        headers: corsHeaders,
      },
    ];
  },
};

export default nextConfig;
