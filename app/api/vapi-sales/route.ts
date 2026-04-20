export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const PLANS: Record<string, { priceId: string; name: string; price: string }> = {
  pilot:      { priceId: process.env.STRIPE_PRICE_PILOT!,      name: "Pilot",      price: "$499/mo" },
  starter:    { priceId: process.env.STRIPE_PRICE_STARTER!,    name: "Starter",    price: "$999/mo" },
  growth:     { priceId: process.env.STRIPE_PRICE_GROWTH!,     name: "Growth",     price: "$2,499/mo" },
  enterprise: { priceId: process.env.STRIPE_PRICE_ENTERPRISE!, name: "Enterprise", price: "Custom" },
};

async function createCheckoutUrl(plan: string, email: string): Promise<string> {
  const planData = PLANS[plan] ?? PLANS.pilot;
  const baseUrl = "https://agentnx.ai";

  const body = new URLSearchParams({
    mode: "subscription",
    "line_items[0][price]": planData.priceId,
    "line_items[0][quantity]": "1",
    customer_email: email,
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/pricing`,
    billing_address_collection: "required",
    allow_promotion_codes: "true",
    "metadata[plan]": plan,
    "metadata[source]": "voice_agent",
  });

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const session = await res.json();
  if (!res.ok || !session.url) throw new Error(session.error?.message ?? "Stripe failed");
  return session.url;
}

async function sendPaymentEmail(email: string, plan: string, checkoutUrl: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const planData = PLANS[plan] ?? PLANS.pilot;
  await resend.emails.send({
    from: "AgentNX <william@agentnx.ai>",
    to: email,
    subject: `Your AgentNX ${planData.name} plan — get started`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#0a0f1e;color:#e5e7eb;border-radius:12px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#3b82f6;margin-bottom:16px;">AgentNX</div>
        <h1 style="font-size:24px;font-weight:800;margin:0 0 8px;">You're one step away.</h1>
        <p style="color:#9ca3af;margin:0 0 24px;">Here's your personalized link to get started with the <strong style="color:#e5e7eb;">${planData.name} plan</strong> at <strong style="color:#e5e7eb;">${planData.price}</strong>.</p>
        <a href="${checkoutUrl}" style="display:inline-block;background:#3b82f6;color:#fff;font-weight:700;font-size:15px;padding:14px 28px;border-radius:999px;text-decoration:none;">
          Complete Setup →
        </a>
        <p style="color:#6b7280;font-size:12px;margin-top:32px;">This link is personalized for ${email}. If you have questions, reply to this email.</p>
      </div>
    `,
  });
}

// VAPI calls this webhook when the sales agent uses a tool
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // VAPI tool call structure
    const toolCall = body?.message?.toolCalls?.[0];
    const functionName = toolCall?.function?.name;
    const args = toolCall?.function?.arguments ?? {};

    if (functionName === "send_payment_link") {
      const { email, plan = "pilot", business_summary } = args;

      if (!email) {
        return NextResponse.json({
          results: [{ toolCallId: toolCall.id, result: "I need your email address to send the link. What's the best email for you?" }]
        });
      }

      const checkoutUrl = await createCheckoutUrl(plan.toLowerCase(), email);
      await sendPaymentEmail(email, plan.toLowerCase(), checkoutUrl);

      const planData = PLANS[plan.toLowerCase()] ?? PLANS.pilot;

      console.log(`[vapi-sales] Payment link sent to ${email} — ${planData.name} plan${business_summary ? ` — ${business_summary}` : ""}`);

      return NextResponse.json({
        results: [{
          toolCallId: toolCall.id,
          result: `Done! I just sent a personalized setup link to ${email} for the ${planData.name} plan at ${planData.price}. Click it whenever you're ready — it takes less than 2 minutes. Is there anything else you'd like to know before you get started?`
        }]
      });
    }

    // Unknown tool
    return NextResponse.json({
      results: [{ toolCallId: toolCall?.id, result: "Tool not recognized." }]
    });

  } catch (err) {
    console.error("[vapi-sales] error:", err);
    return NextResponse.json({
      results: [{ toolCallId: "error", result: "Something went wrong sending the link. Can I get your email again and try once more?" }]
    });
  }
}
