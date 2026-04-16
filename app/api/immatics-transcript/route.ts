import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!messages || messages.length === 0) {
    return NextResponse.json({ description: "" });
  }

  const transcript = (messages as Array<{ role: string; text: string }>)
    .map((m) => `${m.role === "assistant" ? "Agent" : "Operator"}: ${m.text}`)
    .join("\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `Below is a voice interview transcript between an AI intake agent (Alex) and a manufacturing operator reporting a GMP deviation at immatics.

Extract the key facts and compile them into a concise, professional deviation description suitable for a Veeva Vault QMS record. Include: what happened, when it was discovered, what was observed (include any measurements, readings, or alarm values mentioned), and the current status of the batch or affected area.

Write it as a single factual paragraph — no bullet points, no headers, no preamble. If a piece of information was not discussed, omit it rather than guessing.

TRANSCRIPT:
${transcript}

Respond with ONLY the compiled description text.`,
      },
    ],
  });

  const description = (response.content[0] as { type: string; text: string }).text.trim();
  return NextResponse.json({ description });
}
