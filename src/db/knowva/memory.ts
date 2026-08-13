import { supabase } from "@/lib/supabase";
import type { Memory } from "@/services/knowva";

export async function createMemories(memories: Memory[], userId: string) {
  if (!memories.length) return;

  const { error } = await supabase
    .from("user_memories")
    .insert(memories.map(memory => ({
      user_id: userId,
      ...memory,
    })));

  if (error) throw error;
}

export async function getMemories(userId: string) {
  const { data, error } = await supabase
    .from("user_memories")
    .select("category, content, importance, confidence")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

// TODO: getMemoryById()
// TODO: updateMemory()
// TODO: deleteMemory()
