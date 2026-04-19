import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Connect to an MCP server and return a ready client
async function connectToMcpServer(serverUrl: string, apiKey?: string) {
  const client = new Client({ name: "agentnx", version: "1.0.0" });

  const headers: Record<string, string> = {};
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

  // Try Streamable HTTP first (modern), fall back to SSE (legacy)
  try {
    const transport = new StreamableHTTPClientTransport(new URL(serverUrl), { requestInit: { headers } });
    await client.connect(transport);
  } catch {
    const transport = new SSEClientTransport(new URL(serverUrl), { requestInit: { headers } });
    await client.connect(transport);
  }

  return client;
}

// Convert MCP tool definitions to Anthropic tool format
function mcpToolsToAnthropic(mcpTools: Awaited<ReturnType<Client["listTools"]>>["tools"]) {
  return mcpTools.map((t) => ({
    name: t.name,
    description: t.description ?? "",
    input_schema: (t.inputSchema as Anthropic.Tool["input_schema"]) ?? { type: "object" as const, properties: {} },
  }));
}

export async function POST(req: NextRequest) {
  try {
    const { serverUrl, apiKey, message, systemPrompt } = await req.json();

    if (!serverUrl || !message) {
      return NextResponse.json({ error: "serverUrl and message are required" }, { status: 400 });
    }

    // Connect to the MCP server
    const mcpClient = await connectToMcpServer(serverUrl, apiKey);

    // Discover what tools this MCP server exposes
    const { tools: mcpTools } = await mcpClient.listTools();
    const anthropicTools = mcpToolsToAnthropic(mcpTools);

    const messages: Anthropic.MessageParam[] = [{ role: "user", content: message }];
    const system = systemPrompt ?? "You are an AgentNX AI agent. Use the available tools to complete the user's request. Be concise and action-oriented.";

    let finalText = "";

    // Agentic loop — Claude calls tools until it's done
    while (true) {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        system,
        tools: anthropicTools,
        messages,
      });

      // Collect any text from this turn
      for (const block of response.content) {
        if (block.type === "text") finalText += block.text;
      }

      // If Claude is done, break
      if (response.stop_reason === "end_turn") break;

      // If Claude wants to call tools, execute them
      if (response.stop_reason === "tool_use") {
        const toolUseBlocks = response.content.filter((b) => b.type === "tool_use");

        // Add Claude's response to messages
        messages.push({ role: "assistant", content: response.content });

        // Execute each tool call via MCP and collect results
        const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
          toolUseBlocks.map(async (block) => {
            if (block.type !== "tool_use") throw new Error("unexpected block type");
            try {
              const result = await mcpClient.callTool({
                name: block.name,
                arguments: block.input as Record<string, unknown>,
              });
              return {
                type: "tool_result" as const,
                tool_use_id: block.id,
                content: JSON.stringify(result.content),
              };
            } catch (err) {
              return {
                type: "tool_result" as const,
                tool_use_id: block.id,
                is_error: true,
                content: `Tool error: ${err instanceof Error ? err.message : String(err)}`,
              };
            }
          })
        );

        messages.push({ role: "user", content: toolResults });
        continue;
      }

      break;
    }

    await mcpClient.close();

    return NextResponse.json({
      response: finalText,
      toolsAvailable: mcpTools.map((t) => t.name),
    });
  } catch (err) {
    console.error("[mcp-agent]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to connect to MCP server" },
      { status: 500 }
    );
  }
}

// List tools available on a given MCP server (no agent run)
export async function GET(req: NextRequest) {
  try {
    const serverUrl = req.nextUrl.searchParams.get("serverUrl");
    const apiKey = req.nextUrl.searchParams.get("apiKey") ?? undefined;

    if (!serverUrl) {
      return NextResponse.json({ error: "serverUrl is required" }, { status: 400 });
    }

    const mcpClient = await connectToMcpServer(serverUrl, apiKey);
    const { tools } = await mcpClient.listTools();
    await mcpClient.close();

    return NextResponse.json({
      serverUrl,
      tools: tools.map((t) => ({ name: t.name, description: t.description })),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to connect" },
      { status: 500 }
    );
  }
}
