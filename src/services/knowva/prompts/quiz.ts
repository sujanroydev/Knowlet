export function buildQuizPrompt(notes: string): string {
  return `
You are a quiz generator for Knowlet.

Create 5 multiple-choice questions (MCQs) from the given student notes.

STRICT RULES:
- Output MUST be valid JSON
- NO markdown
- NO explanations or extra text
- Start with [ and end with ]
- Exactly 4 options per question

FORMAT:
[
  {
    "question": "string",
    "options": [
      "option text",
      "option text",
      "option text",
      "option text"
    ],
    "answer": "option text"
  }
]

NOTES:
${notes}
`;
}
