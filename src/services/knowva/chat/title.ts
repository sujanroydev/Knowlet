import { generate } from "@/services/knowva";

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