"use server";

import connectDb from "@/lib/db";
import type { Message, Mode } from "@/types/knowva";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth"

import { generateChatTitle as _generateChatTitle } from "@/services/knowva";

export async function generateChatTitle(message: string) {
  return await _generateChatTitle(message);
}

export async function newChat() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const { ok, payload } = await verifyJwt(token);

    if (!ok) throw new Error("Unauthorized")

    const db = await connectDb();

    const { data, error } = await db
      .from("knowva_chats")
      .insert({
        user_id: payload.user_id,
        title: "Untitled Chat",
        mode: "chat",
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("no data returned");

    return data;
  } catch(error) {
    console.log(error);
  }
}

export async function removeChat(chatId: string) {
  try {
    const db = await connectDb();

    const { error } = await db
      .from("knowva_chats")
      .delete()
      .eq("id", chatId);

    if (error) throw error;
  } catch(error) {
    console.log(error);
  }
}

export async function saveMessage(message: Message, chatId: string, parentId: string, model: string) {
  try {
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

    return data;
  } catch(error) {
    console.log(error);
  }
}

export async function fetchChats() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const { ok, payload } = await verifyJwt(token);

    if (!ok) throw new Error("Unauthorized")

    const db = await connectDb();

    const { data, error } = await db
      .from("knowva_chats")
      .select("id, title, created_at")
      .eq("user_id", payload.user_id)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return data;
  } catch(error) {
    console.log(error);
  }

}

export async function fetchMessages(chatId: string) {
  try {
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
  } catch(error) {
    console.log(error);
  }
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
