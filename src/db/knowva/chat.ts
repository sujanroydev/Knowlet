import connectDb from "@/lib/db";
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
  const db = await connectDb();

  const { data, error } = await db
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
  const db = await connectDb();

  const { error } = await db
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
  const db = await connectDb();

  const { data, error } = await db
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
  const db = await connectDb();

  const { data, error } = await db
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
  const db = await connectDb();

  const { error } = await db
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
  const db = await connectDb();

  const { error } = await db
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
  const db = await connectDb();

  const { error } = await db
    .from("knowva_chats")
    .update({
      archived: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", chatId);

  if (error) throw error;
}
