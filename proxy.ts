import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const ALLOWED_ORIGINS = ["https://agentnx.ai", "https://www.agentnx.ai"];

export default clerkMiddleware(async (_auth, req) => {
  const { pathname } = req.nextUrl;

  // ── CORS handling for API routes ──────────────────────────────────────────
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const origin = req.headers.get("origin") ?? "";
  const allowed = ALLOWED_ORIGINS.includes(origin);

  if (req.method === "OPTIONS") {
    const pre = new NextResponse(null, { status: 204 });
    if (allowed) pre.headers.set("Access-Control-Allow-Origin", origin);
    pre.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    pre.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    pre.headers.set("Access-Control-Max-Age", "86400");
    return pre;
  }

  const res = NextResponse.next();
  if (allowed) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  return res;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
