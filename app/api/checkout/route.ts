export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

const PLANS: Record<string, { priceId: string; name: string }> = {
  starter:    { priceId: process.env.STRIPE_PRICE_STARTER!,    name: "Starter" },
  growth:     { priceId: process.env.STRIPE_PRICE_GROWTH!,     name: "Growth" },
  enterprise: { priceId: process.env.STRIPE_PRICE_ENTERPRISE!, name: "Enterprise" },
};

export async function GET(req: NextRequest) {
  try {
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
