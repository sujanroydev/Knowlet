"use server";

import connectDb from "@/lib/db";
import type { Message } from "@/types/knowva";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth"

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

export async function saveMessage(message: Message, chatId: string, parentId: string): string {
  try {
    const db = await connectDb();

    const { data, error } = await db
      .from("knowva_messages")
      .insert({
        chat_id: chatId,
        parent_id: parentId || null,
        role: message.sender,
        content: message.text,
        model: "unknown"
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
