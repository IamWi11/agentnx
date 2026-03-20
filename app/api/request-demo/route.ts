import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY ?? "");
    const { email } = await req.json();

    await resend.emails.send({
      from: "AgentNX <noreply@agentnx.ai>",
      to: "image1.ohhh1@gmail.com",
      subject: "New Demo Request — AgentNX.ai",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0a0f1e; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">New Demo Request</h1>
          </div>
          <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <p style="color: #374151;">Someone requested a demo on AgentNX.ai:</p>
            <p style="font-size: 18px; font-weight: bold; color: #111827;">${email}</p>
            <p style="color: #6b7280; font-size: 14px;">Reply to this email or reach out directly to schedule their demo.</p>
          </div>
          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">
            AgentNX.ai — AI Agents for Pharma Operations
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("request-demo error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
