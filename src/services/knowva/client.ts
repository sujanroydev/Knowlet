import { gemini } from "@/lib/gemini";
import { DEFAULT_MODEL, ModelId } from "@/config/ai";
import { quizSchema } from "./generation/quiz";
import { createResourceSchema } from "./generation/resource";
import { Mode } from "@/types/knowva";

type GenerateOptions = {
  prompt: string;
  mode?: Mode;
  model?: ModelId;
};

export async function generate({
  prompt,
  model = DEFAULT_MODEL,
}: GenerateOptions): Promise<string> {
  try {
    const response = await gemini.models.generateContent({
      model,
      contents: prompt,
    });

    if (!response.text) throw new Error("Failed to generate response");

    return response.text.trim();
  } catch (error: any) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate AI response.";

    throw new Error(message);
  }
}

export async function generateStream({
  prompt,
  mode = "chat",
  model = DEFAULT_MODEL,
}: GenerateOptions): Promise<ReadableStream<any>> {
  const responseSchema = {
    quiz: quizSchema,
    "create-resource": createResourceSchema,
  } as const;

  try {
    const config =
      mode === "create-resource" || mode === "quiz"
        ? {
            responseMimeType: "application/json",
            responseSchema: responseSchema[mode],
          }
        : undefined;

    const stream = await gemini.models.generateContentStream({
      model,
      contents: prompt,
      config,
    });

    const encoder = new TextEncoder();

    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text ?? "";

            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return responseStream;
  } catch (error: any) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate AI response.";

    throw new Error(message);
  }
}
