import { supabase } from "@/lib/supabase";

import type { Message, NewMessage, Mode } from "@/types/knowva";
import { updateLastMessageTime } from "@/db/knowva/chat";

const messageSelect = `
  id,
  chat_id,
  parent_id,
  role,
  content,
  mode,
  model,
  created_at
`;

export async function saveMessage(message: NewMessage) {
  console.log("New Message :", message)
  const { data, error } = await supabase
    .from("knowva_messages")
    .insert(message)
    .select(messageSelect)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("no data returned");

  void updateLastMessageTime(message.chat_id).catch((error) => {
    console.error("Failed to update chat activity:", error);
  });

  return data;
}

export async function fetchMessages(chatId: string) {
  const { data, error } = await supabase
    .from("knowva_messages")
    .select(messageSelect)
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data;
}
