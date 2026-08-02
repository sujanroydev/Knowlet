"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

type GenerateOptions = {
  prompt: string;
  model?: string;
  retries?: number;
};

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function generate({
  prompt,
  model = "gemini-3.1-flash-lite",
  retries = 3,
}: GenerateOptions): Promise<string> {
  const ai = genAI.getGenerativeModel({ model });

  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await ai.generateContent(prompt);

      return result.response.text().trim();
    } catch (error: any) {
      lastError = error;

      const status = error?.status ?? error?.code;
      const retryable = [429, 500, 503].includes(status);

      if (!retryable || attempt === retries) {
        break;
      }

      // Exponential backoff: 1s, 2s, 4s...
      await sleep(1000 * 2 ** (attempt - 1));
    }
  }

  const message =
    lastError instanceof Error
      ? lastError.message
      : "Failed to generate AI response.";

  throw new Error(message);
}

export async function generateChatTitle(message: string): Promise<string> {
  const prompt = `
Generate a short chat title.

Rules:
- Maximum 6 words.
- No quotes.
- No punctuation at the end.
- Return only the title.

Message:
${message}
`;

  try {
    return await generate({ prompt });
  } catch (error) {
    console.error("Failed to generate chat title:", error);

    return "Untitled Chat";
  }
}