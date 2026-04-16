import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Alex, a GMP deviation intake agent for immatics — a clinical-stage cell therapy company. You assist manufacturing operators in reporting deviation events by voice.

Collect these four things through natural, friendly conversation:
1. What happened (the deviation event itself)
2. When it was discovered (date and time)
3. What was observed (measurements, readings, alarm values, visible signs)
4. Current status of the affected batch or area

Be conversational — not robotic or scripted. Ask natural follow-ups if an answer is vague.
If the operator asks about criticality, SOPs, escalation, or GMP requirements — answer helpfully.
You know cell therapy manufacturing, 21 CFR Part 11, CAPA, and Veeva Vault QMS.

When you have everything, say: "Perfect, I have everything I need. Click Save to Form when you're ready."
Keep responses short — two to three sentences max. This is a voice call.`;

// Cache the assistant ID for the lifetime of the serverless instance
let cachedId: string | null = null;

export async function POST() {
  if (cachedId) return NextResponse.json({ assistantId: cachedId });

  const res = await fetch("https://api.vapi.ai/assistant", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Alex — immatics Deviation Intake",
      model: {
        provider: "anthropic",
        model: "claude-sonnet-4-20250514",
        messages: [{ role: "system", content: SYSTEM_PROMPT }],
      },
      voice: {
        provider: "openai",
        voiceId: "nova",
        model: "tts-1",
      },
      firstMessage: "Hi, I'm Alex — your deviation intake agent. Tell me, what happened?",
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("VAPI assistant creation failed:", data);
    return NextResponse.json({ error: data }, { status: 500 });
  }

  cachedId = data.id;
  return NextResponse.json({ assistantId: data.id });
}
