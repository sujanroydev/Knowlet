import connectDb from "@/lib/db";
import type { Memory } from "@/services/knowva";

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

export async function getMemories(userId: string) {
  const db = await connectDb();

  const { data, error } = await db
    .from("user_memories")
    .select("category, content, importance, confidence")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

// TODO: getMemoryById()
// TODO: updateMemory()
// TODO: deleteMemory()
