import connectDb from "@/lib/db";

import type { Message, Mode } from "@/types/knowva";
import { updateLastMessageTime } from "@/db/knowva/chat";

export async function saveMessage(message: Message, chatId: string, parentId: string, model: string) {
  const db = await connectDb();

  const { data, error } = await db
    .from("knowva_messages")
    .insert({
      chat_id: chatId,
      parent_id: parentId || null,
      role: message.sender,
      content: message.text,
      model: model
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("no data returned");

  void updateLastMessageTime(chatId).catch((error) => {
    console.error("Failed to update chat activity:", error);
  });

  return data;
}

export async function fetchMessages(chatId: string) {
  const db = await connectDb();

  const { data, error } = await db
    .from("knowva_messages")
    .select("id, parent_id, role, content, created_at")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data.map(d => ({
    id: d.id,
    sender: d.role,
    text: d.content,
    mode: "normal" as Mode,
    time: d.created_at,
  }));
}
