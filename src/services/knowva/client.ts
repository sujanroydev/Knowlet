import { gemini } from "@/lib/gemini";
import { sleep } from "@/utils/sleep";
import { DEFAULT_MODEL, ModelId } from "@/config/ai";

type GenerateOptions = {
  prompt: string;
  model?: ModelId;
  retries?: number;
};

export async function generate({
  prompt,
  model = DEFAULT_MODEL,
  retries = 3,
}: GenerateOptions): Promise<string> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await gemini.models.generateContent({
        model,
        contents: prompt,
      });

      if (!response.text) throw new Error("Failed to generate response");

      return response.text.trim();
    } catch (error: any) {
      lastError = error;

      const status = error?.status ?? error?.code;
      const retryable = [429, 500, 503].includes(status);

      if (!retryable || attempt === retries) {
        break;
      }

      await sleep(1000 * 2 ** (attempt - 1));
    }
  }

  const message =
    lastError instanceof Error
      ? lastError.message
      : "Failed to generate AI response.";

  throw new Error(message);
}
