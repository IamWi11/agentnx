import { NextRequest, NextResponse } from "next/server";
import { escapeHtml, isValidEmail, checkRateLimit, getClientIp, verifyTurnstile, checkCsrfOrigin } from "../../lib/security";
import { logger } from "../../lib/logger";

export async function POST(req: NextRequest) {
  if (!checkCsrfOrigin(req)) {
    logger.warn("request-demo", "CSRF origin rejected", { origin: req.headers.get("origin") });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Rate limit: 5 requests per IP per 10 minutes
  const ip = getClientIp(req);
  if (!checkRateLimit(`request-demo:${ip}`, 5, 10 * 60 * 1000)) {
    logger.warn("request-demo", "Rate limit hit", { ip });
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { email, turnstileToken } = body as Record<string, unknown>;

  // Verify Turnstile token
  const turnstilePassed = await verifyTurnstile(turnstileToken as string, getClientIp(req));
  if (!turnstilePassed) {
    return NextResponse.json({ error: "Security check failed" }, { status: 403 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY ?? "");

    // Escape before inserting into email HTML
    const safeEmail = escapeHtml(email);

    logger.info("request-demo", "Demo request received", { email: safeEmail });
    await resend.emails.send({
      from: "AgentNX <noreply@agentnx.ai>",
      to: "william@agentnx.ai",
      subject: "New Demo Request — AgentNX.ai",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0a0f1e; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">New Demo Request</h1>
          </div>
          <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <p style="color: #374151;">Someone requested a demo on AgentNX.ai:</p>
            <p style="font-size: 18px; font-weight: bold; color: #111827;">${safeEmail}</p>
            <p style="color: #6b7280; font-size: 14px;">Reply to this email or reach out directly to schedule their demo.</p>
          </div>
          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">
            AgentNX.ai — AI Agents for Enterprise &amp; Government Operations
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("request-demo", "Failed to send demo request", { err: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "Failed to send request" }, { status: 500 });
  }
}
