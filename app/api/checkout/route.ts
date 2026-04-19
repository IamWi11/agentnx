export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter: 10 checkout attempts per IP per minute
const _rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = _rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    _rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 10) return true;
  entry.count++;
  return false;
}

const PLANS: Record<string, { priceId: string; name: string }> = {
  pilot:      { priceId: process.env.STRIPE_PRICE_PILOT!,      name: "Pilot" },
  starter:    { priceId: process.env.STRIPE_PRICE_STARTER!,    name: "Starter" },
  growth:     { priceId: process.env.STRIPE_PRICE_GROWTH!,     name: "Growth" },
  enterprise: { priceId: process.env.STRIPE_PRICE_ENTERPRISE!, name: "Enterprise" },
};

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const plan = req.nextUrl.searchParams.get("plan")?.toLowerCase();

    if (!plan || !PLANS[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const { priceId } = PLANS[plan];
    const baseUrl = "https://agentnx.ai";

    const body = new URLSearchParams({
      mode: "subscription",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      billing_address_collection: "required",
      allow_promotion_codes: "true",
      "metadata[plan]": plan,
    });

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const session = await response.json();

    if (!response.ok || !session.url) {
      console.error("Stripe error:", session);
      return NextResponse.json({ error: "Stripe session failed", detail: session.error?.message }, { status: 500 });
    }

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Checkout failed", detail: String(err) }, { status: 500 });
  }
}
