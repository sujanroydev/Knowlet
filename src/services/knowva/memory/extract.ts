import { generate } from "@/services/knowva";

export interface Memory {
  content: string;
  category:
    | "profile"
    | "preference"
    | "project"
    | "goal"
    | "skill"
    | "relationship"
    | "other";
  importance: number;
  confidence: number;
}

export async function extractMemories(
  message: string,
): Promise<Memory[]> {
  const prompt = `
Extract long-term memories from this message.

Store ONLY information that is useful in future conversations.

Store:
- User profile
- Preferences
- Projects
- Goals
- Skills
- Relationships

Do NOT store:
- Temporary requests
- Greetings
- Small talk
- Questions without personal information
- One-time information

Return ONLY valid JSON in this format:

[
  {
    "content": "User prefers TypeScript.",
    "category": "preference",
    "importance": 8,
    "confidence": 0.98
  }
]

Return [] if nothing should be remembered.

Message:
${message}
`;

  try {
    const result = await generate({ prompt });

    return JSON.parse(result) as Memory[];
  } catch (error) {
    console.error("Failed to extract memories:", error);

    return [];
  }
}