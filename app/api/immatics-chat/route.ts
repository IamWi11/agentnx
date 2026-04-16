import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are Alex, a GMP deviation intake agent for immatics — a clinical-stage cell therapy company. You help manufacturing operators report deviation events.

Collect these four things through natural conversation:
1. What happened (the deviation event)
2. When it was discovered (date and time)
3. What was observed (measurements, readings, alarm values, visible signs)
4. Current status of the affected batch or area

Be conversational and professional — not robotic. Ask natural follow-ups if an answer is vague. For example: "Do you have the exact temperature reading?" or "Was the batch quarantined right away?"

If the operator asks you questions about criticality, SOPs, escalation, or GMP requirements — answer helpfully. You know cell therapy manufacturing, 21 CFR Part 11, CAPA, and Veeva Vault QMS.

When you have all four pieces, say exactly: "Got it — I have everything I need. Click 'Save to Form' when you're ready." Keep responses short — two to three sentences max. This is a quick intake conversation, not a consultation.`;

export async function POST(req: NextRequest) {
  let { messages } = await req.json() as { messages: Array<{ role: string; content: string }> };

  // Replace __start__ sentinel with an instruction to open the conversation
  const cleaned = messages.map(m => ({
    role: (m.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
    content: m.content === "__start__"
      ? "Start the interview. Greet me briefly and ask your first question."
      : m.content,
  }));

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 200,
    system: SYSTEM_PROMPT,
    messages: cleaned,
    stream: true,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
