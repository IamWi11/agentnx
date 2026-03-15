import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const data = await req.json();

  const prompt = `You are a GMP compliance expert with 20+ years of experience in pharmaceutical manufacturing.
Generate a complete, professional GMP Deviation Report based on the following information.

The report must follow standard pharmaceutical industry format and include all required sections for 21 CFR Part 211 compliance.

INPUT DATA:
- Site/Facility: ${data.site}
- Product Name: ${data.product}
- Batch/Lot Number: ${data.batchNumber}
- Date of Deviation: ${data.deviationDate}
- Discovered By: ${data.discoveredBy}
- Department: ${data.department}
- Deviation Description: ${data.description}
- Immediate Actions Taken: ${data.immediateActions}
- Potential Impact/Risk: ${data.potentialImpact}
- Report Prepared By: ${data.reportedBy}

Generate a complete GMP Deviation Report with the following sections:

1. DEVIATION REPORT HEADER
   - Report Number: [auto-generate format: DEV-YYYY-XXXX]
   - Date Initiated
   - Classification (Critical/Major/Minor — determine based on description)
   - Status: Open

2. PRODUCT & BATCH INFORMATION

3. DEVIATION DESCRIPTION
   - Detailed narrative of what occurred
   - Timeline of events

4. IMMEDIATE CONTAINMENT ACTIONS

5. IMPACT ASSESSMENT
   - Product quality impact
   - Patient safety impact
   - Regulatory/compliance impact
   - Risk classification with justification

6. ROOT CAUSE ANALYSIS (PRELIMINARY)
   - Probable root cause category (Human Error / Equipment / Process / Material / Environment)
   - Initial findings
   - Note: Full RCA to be completed within 30 days

7. CORRECTIVE AND PREVENTIVE ACTIONS (CAPA)
   - Proposed corrective actions with target dates
   - Proposed preventive actions
   - Responsible parties (use department names)

8. BATCH DISPOSITION RECOMMENDATION
   - Recommended action for affected batch

9. REGULATORY REPORTING ASSESSMENT
   - Determine if reportable under 21 CFR Part 314 or other regulations

10. APPROVALS SECTION
    - QA Review: _______________ Date: ___________
    - QA Manager: ______________ Date: ___________
    - Site Director: ____________ Date: ___________

Format the report professionally with clear section headers, proper spacing, and in plain text format suitable for a pharmaceutical QMS system.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const reportText = message.content[0].type === "text" ? message.content[0].text : "";

  return new NextResponse(reportText, {
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": `attachment; filename="Deviation_Report_${data.batchNumber}_${data.deviationDate}.txt"`,
    },
  });
}
