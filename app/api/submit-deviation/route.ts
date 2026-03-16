import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
  const Groq = (await import("groq-sdk")).default;
  const { Resend } = await import("resend");
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY ?? "" });
  const resend = new Resend(process.env.RESEND_API_KEY ?? "");
  const data = await req.json();

  // 1. Generate the deviation report with AI
  const prompt = `You are a GMP compliance expert. Generate a complete, professional GMP Deviation Report.

INPUT:
- Site: ${data.site}
- Product: ${data.product}
- Batch/Lot: ${data.batchNumber}
- Date: ${data.deviationDate}
- Discovered By: ${data.discoveredBy}
- Department: ${data.department}
- Description: ${data.description}
- Immediate Actions: ${data.immediateActions}
- Potential Impact: ${data.potentialImpact}
- Reported By: ${data.reportedBy}

Generate a complete GMP Deviation Report including:
1. HEADER (auto-generate report number DEV-${Date.now()}, classify as Critical/Major/Minor)
2. PRODUCT & BATCH INFORMATION
3. DEVIATION DESCRIPTION (detailed narrative + timeline)
4. IMMEDIATE CONTAINMENT ACTIONS
5. IMPACT ASSESSMENT (product quality, patient safety, regulatory)
6. ROOT CAUSE ANALYSIS - PRELIMINARY (category + initial findings)
7. CAPA RECOMMENDATIONS (3-5 specific actions with owners and 30-day target dates)
8. BATCH DISPOSITION RECOMMENDATION
9. REGULATORY REPORTING ASSESSMENT
10. APPROVALS SECTION (blank signature lines)

Be specific, professional, and GMP-compliant.`;

  const completion = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const reportText = completion.choices[0]?.message?.content ?? "";

  // 2. Email the report to QA manager for approval
  const qaEmail = data.qaManagerEmail || process.env.DEFAULT_QA_EMAIL;

  await resend.emails.send({
    from: "AgentNX <noreply@agentnx.ai>",
    to: qaEmail,
    subject: `[ACTION REQUIRED] Deviation Report — ${data.product} / ${data.batchNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0a0f1e; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">AgentNX — Deviation Report Pending Approval</h1>
        </div>
        <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
          <p style="color: #374151;">A new GMP deviation report has been submitted and requires your review.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px; font-weight: bold; color: #6b7280; width: 40%;">Product</td><td style="padding: 8px;">${data.product}</td></tr>
            <tr style="background: #f3f4f6;"><td style="padding: 8px; font-weight: bold; color: #6b7280;">Batch/Lot</td><td style="padding: 8px;">${data.batchNumber}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #6b7280;">Date of Deviation</td><td style="padding: 8px;">${data.deviationDate}</td></tr>
            <tr style="background: #f3f4f6;"><td style="padding: 8px; font-weight: bold; color: #6b7280;">Reported By</td><td style="padding: 8px;">${data.reportedBy}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #6b7280;">Department</td><td style="padding: 8px;">${data.department}</td></tr>
          </table>
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; margin: 16px 0;">
            <h3 style="margin: 0 0 8px; color: #111827;">Deviation Summary</h3>
            <p style="color: #374151; margin: 0; font-size: 14px;">${data.description}</p>
          </div>
          <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 12px; margin: 16px 0;">
            <strong>⚠️ Immediate Actions Taken:</strong><br/>
            <span style="font-size: 14px;">${data.immediateActions}</span>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;"/>
          <h3 style="color: #111827;">Full AI-Generated Report:</h3>
          <pre style="background: #f3f4f6; padding: 16px; border-radius: 6px; font-size: 12px; white-space: pre-wrap; overflow-wrap: break-word;">${reportText}</pre>
          <div style="margin-top: 24px; text-align: center;">
            <p style="color: #6b7280; font-size: 13px;">Review the report above and reply to this email to approve, request changes, or escalate.</p>
          </div>
        </div>
        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">
          Powered by AgentNX.ai — AI Agents for Pharma Operations
        </p>
      </div>
    `,
  });

  // 3. Send confirmation to submitter
  await resend.emails.send({
    from: "AgentNX <noreply@agentnx.ai>",
    to: data.submitterEmail,
    subject: `Deviation Report Submitted — ${data.product} / ${data.batchNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0a0f1e; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Deviation Report Submitted ✓</h1>
        </div>
        <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
          <p>Your deviation report for <strong>${data.product} / ${data.batchNumber}</strong> has been submitted and routed to QA for review.</p>
          <p style="color: #6b7280; font-size: 14px;">You will be notified once it has been reviewed and approved.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;"/>
          <h3>Your Report:</h3>
          <pre style="background: #f3f4f6; padding: 16px; border-radius: 6px; font-size: 12px; white-space: pre-wrap;">${reportText}</pre>
        </div>
        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">
          Powered by AgentNX.ai
        </p>
      </div>
    `,
  });

  return NextResponse.json({ success: true, reportPreview: reportText.slice(0, 200) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("submit-deviation error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
