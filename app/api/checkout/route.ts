export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const PLANS: Record<string, { priceId: string; name: string }> = {
  starter: {
    priceId: process.env.STRIPE_PRICE_STARTER!,
    name: "Starter",
  },
  growth: {
    priceId: process.env.STRIPE_PRICE_GROWTH!,
    name: "Growth",
  },
  enterprise: {
    priceId: process.env.STRIPE_PRICE_ENTERPRISE!,
    name: "Enterprise",
  },
};

export async function GET(req: NextRequest) {
  try {
    const plan = req.nextUrl.searchParams.get("plan")?.toLowerCase();

    if (!plan || !PLANS[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const { priceId, name } = PLANS[plan];

    if (!priceId || priceId.startsWith("price_YOUR")) {
      return NextResponse.json(
        { error: `Stripe price ID for ${name} not configured` },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agentnx.ai";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      billing_address_collection: "required",
      allow_promotion_codes: true,
      metadata: { plan },
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Checkout failed", detail: String(err) },
      { status: 500 }
    );
  }
}
