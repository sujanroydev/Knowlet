import { supabase } from "@/lib/supabase";
import { Chat } from "@/types/knowva";

const chatSelect = `
  id,
  title,
  mode,
  pinned,
  archived,
  created_at,
  last_message_at
`;

export async function newChat(
  userId: string,
  mode = "chat"
) {
  const { data, error } = await supabase
    .from("knowva_chats")
    .insert({
      user_id: userId,
      title: "Untitled Chat",
      mode,
    })
    .select(chatSelect)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("No data returned");

  return data as Chat;
}

export async function deleteChat(
  chatId: string
) {
  const { data, error } = await supabase
    .from("knowva_chats")
    .update({
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", chatId);

  if (error) throw error;
}

export async function fetchChats(
  userId: string
) {
  const { data, error } = await supabase
    .from("knowva_chats")
    .select(chatSelect)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("last_message_at", { ascending: false });

  if (error) throw error;

  return data as Chat[];
}

export async function renameChat(
  chatId: string,
  newName: string
) {
  const { data, error } = await supabase
    .from("knowva_chats")
    .update({
      title: newName,
      updated_at: new Date().toISOString(),
    })
    .eq("id", chatId)
    .select(chatSelect)
    .maybeSingle();

  if (error) throw error;

  return data as Chat;
}

export async function updateLastMessageTime(
  chatId: string
) {
  const { data, error } = await supabase
    .from("knowva_chats")
    .update({
      last_message_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", chatId);

  if (error) throw error;
}


export async function pinChat(
  chatId: string,
  pinned: boolean
) {
  const { data, error } = await supabase
    .from("knowva_chats")
    .update({
      pinned,
      updated_at: new Date().toISOString(),
    })
    .eq("id", chatId);

  if (error) throw error;
}


export async function archiveChat(
  chatId: string,
  archived: boolean
) {
  const { data, error } = await supabase
    .from("knowva_chats")
    .update({
      archived: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", chatId);

  if (error) throw error;
}
