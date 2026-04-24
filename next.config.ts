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
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://va.vercel-scripts.com https://cdn.vercel-insights.com https://challenges.cloudflare.com https://*.clerk.accounts.dev https://*.daily.co",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.vapi.ai wss://*.vapi.ai https://*.daily.co wss://*.daily.co https://*.pluot.blue wss://*.pluot.blue https://vitals.vercel-insights.com https://va.vercel-scripts.com https://api.stripe.com https://challenges.cloudflare.com https://api.anthropic.com https://*.clerk.accounts.dev",
      "media-src 'self' blob: mediastream:",
      // Daily.co AudioWorklet uses blob: workers for mic audio processing
      "worker-src blob: 'self'",
      "frame-src https://challenges.cloudflare.com https://*.daily.co",
      "frame-ancestors 'none'",
      "form-action 'self'",
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
  serverExternalPackages: ["groq-sdk", "resend", "@modelcontextprotocol/sdk"],
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
