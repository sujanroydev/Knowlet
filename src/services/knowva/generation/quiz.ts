import { Type } from "@google/genai";

export const quizSchema = {
  type: Type.ARRAY,
  minItems: 5,
  maxItems: 5,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
      },
      options: {
        type: Type.ARRAY,
        minItems: 4,
        maxItems: 4,
        items: {
          type: Type.STRING,
        },
      },
      answer: {
        type: Type.INTEGER,
        minimum: 0,
        maximum: 3,
      },
    },
    required: ["question", "options", "answer"],
  },
};

export function buildQuizPrompt(notes: string): string {
  return `
You are Knowva, Knowlet's AI learning assistant, specialized in quiz generation.

Create exactly 5 multiple-choice questions from the given student notes.

Rules:
- Create exactly 5 questions.
- Each question must have exactly 4 options.
- Options must be distinct.
- Each question must have exactly one correct answer.
- "answer" must be the zero-based index of the correct option.
- The answer index must be 0, 1, 2, or 3.
- Questions and answers must be based only on the provided notes.
- Do not add information that is not supported by the notes.

NOTES:
${notes}
`;
}
