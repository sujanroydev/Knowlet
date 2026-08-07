import connectDb from "@/lib/db";
import type { Memory } from "@/services/knowva/memory";

export async function createMemories(memories: Memory[], userId: string) {
  if (!memories.length) return;

  const db = await connectDb();

  const { error } = await db
    .from("user_memories")
    .insert(memories.map(memory => ({
      user_id: userId,
      ...memory,
    })));

  if (error) throw error;
}
