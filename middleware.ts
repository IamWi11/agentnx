import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = ["https://agentnx.ai", "https://www.agentnx.ai"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only handle CORS for API routes
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const origin = req.headers.get("origin") ?? "";
  const allowed = ALLOWED_ORIGINS.includes(origin);

  // OPTIONS preflight — respond without forwarding to the route handler
  if (req.method === "OPTIONS") {
    const pre = new NextResponse(null, { status: 204 });
    if (allowed) pre.headers.set("Access-Control-Allow-Origin", origin);
    pre.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    pre.headers.set("Access-Control-Allow-Headers", "Content-Type");
    pre.headers.set("Access-Control-Max-Age", "86400");
    return pre;
  }

  const res = NextResponse.next();

  // Grant CORS only to our own domains.
  // Requests with no Origin header (server-to-server, curl) get no CORS header —
  // that's correct; they don't need one.
  // Cross-origin requests from other domains get no grant — browser blocks them.
  if (allowed) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  }

  return res;
}

export const config = {
  matcher: "/api/:path*",
};
