import connectDb from "@/lib/db";

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
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("No data returned");

  return data;
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
    .select(`
      id,
      title,
      created_at
    `)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("last_message_at", { ascending: false });

  if (error) throw error;

  return data;
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
    .select("id, title, created_at")
    .maybeSingle();

  if (error) throw error;

  return data;
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

  const { data, error } = await db
    .from("knowva_chats")
    .update({
      pinned,
      updated_at: new Date().toISOString(),
    })
    .eq("id", chatId)
    .select()
    .maybeSingle();

  if (error) throw error;

  return data;
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
