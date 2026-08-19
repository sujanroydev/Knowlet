import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";
import { authGate } from "@/lib/auth/authGate";
import { generatePrompt } from "@/services/knowva/prompts";
import { buildDefaultPrompt } from "@/services/knowva/prompts/default";

import { extractMemories } from "@/services/knowva";
import { createMemories, getMemories } from "@/db/knowva/memory";
import { fetchMessages } from "@/db/knowva/message";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, mode, model: selectedModel, chatId } = body;

    if (!text) {
      return new Response(
        JSON.stringify({ success: false, error: "No text provided" }),
        { status: 400, headers: corsHeaders() },
      );
    }

    const { ok, res, payload } = await authGate(req, "jwt");
    if (!ok || !payload) return res;

    const lowerText = text.toLowerCase();

    void (async () => {
      try {
        const memories = await extractMemories(text);
        await createMemories(memories, payload.user_id);
      } catch (error) {
        console.error("Memory extraction failed:", error);
      }
    })();

    const model = genAI.getGenerativeModel({ model: selectedModel });

    let prompt = "";

    if (["quiz", "short", "explain", "create-resource"].includes(mode)) {
      prompt = generatePrompt(mode, text);
    } else {
      let userMemories = "";
      let recentConversation = "";
      let conversationSummary = "";

      const result = await Promise.allSettled([
        await getMemories(payload.user_id),
        await fetchMessages(chatId),
      ]);

      const memories = result[0].status === "fulfilled" ? result[0].value : [];
      const messages = result[1].status === "fulfilled" ? result[1].value : [];

      userMemories = memories
        .map(memory => `- ${memory.content}`)
        .join("\n");

      messages.pop();
      recentConversation = messages
        .map(message => `${message.role}: ${message.content}`)
        .join("\n");

      prompt = buildDefaultPrompt(text, userMemories, recentConversation, conversationSummary);
    }

    let raw = "";

    for (let attempt = 0; attempt < 3; attempt++) {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      raw = response.text();

      if (mode === "quiz" || mode === "create-resource") {
        try {
          const cleaned = cleanJSON(raw);
          const parsed = JSON.parse(cleaned);
          raw = JSON.stringify(parsed);
          break;
        } catch (err) {
          if (attempt === 2) {
            return new Response(
              JSON.stringify({
                success: false,
                error: "Invalid AI response after retries",
                raw,
              }),
              { status: 500, headers: corsHeaders() },
            );
          }
        }
      } else break;
    }

    return new Response(
      JSON.stringify({ success: true, data: raw }),
      { status: 200, headers: corsHeaders() },
    );
  } catch (err) {
    const message = (err as any).message || "";

    if (
      message.includes("429") ||
      message.toLowerCase().includes("quota") ||
      message.toLowerCase().includes("too many requests")
    ) {
      const waitTime = extractRetryTime(message);
      return new Response(
        JSON.stringify({
          success: false,
          type: "rate_limit",
          data: `⏳ AI limit reached. Try again in ${waitTime} seconds.`,
          retryAfter: waitTime,
        }),
        { status: 429, headers: corsHeaders() },
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        errObj: err,
        error: "Something went wrong. Please try again.",
      }),
      { status: 500, headers: corsHeaders() },
    );
  }
}

function cleanJSON(raw: string) {
  return raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function extractRetryTime(errorMessage: string) {
  const match = errorMessage.match(/retryDelay":"(\d+)s"/);
  return match ? parseInt(match[1]) : 20;
}
