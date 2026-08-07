import connectDb from "@/lib/db";

export async function newChat(userId: string) {
  const db = await connectDb();

  const { data, error } = await db
    .from("knowva_chats")
    .insert({
      user_id: userId,
      title: "Untitled Chat",
      mode: "chat",
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("no data returned");

  return data;
}

export async function removeChat(chatId: string) {
  const db = await connectDb();

  const { error } = await db
    .from("knowva_chats")
    .delete()
    .eq("id", chatId);

  if (error) throw error;
}

export async function fetchChats(userId: string) {
  const db = await connectDb();

  const { data, error } = await db
    .from("knowva_chats")
    .select("id, title, created_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function renameChat(chatId: string, newName: string) {
  const db = await connectDb();

  const { data, error } = await db
    .from("knowva_chats")
    .update({
      title: newName,
    })
    .eq("id", chatId)
    .select("id, title, created_at")
    .maybeSingle();

  if (error) throw error;

  return data;
}
