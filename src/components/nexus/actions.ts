"use server";

import connectDb from "@/lib/db";
import type { Message, Mode } from "@/types/knowva";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth"

import { generateChatTitle as _generateChatTitle } from "@/services/knowva";
import {
  saveMessage as _saveMessage,
  fetchMessages as _fetchMessages,
} from "@/db/knowva/message";
import {
  newChat as _newChat,
  fetchChats as _fetchChats,
  removeChat as _removeChat,
  renameChat as _renameChat,
} from "@/db/knowva/chat";

export async function generateChatTitle(message: string) {
  return await _generateChatTitle(message);
}

export async function newChat() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const { ok, payload } = await verifyJwt(token);

    if (!ok) throw new Error("Unauthorized")

    return await _newChat(payload.user_id)
  } catch(error) {
    console.log(error);
  }
}

export async function removeChat(chatId: string) {
  try {
    return await _removeChat(chatId);
  } catch(error) {
    console.log(error);
  }
}

export async function saveMessage(message: Message, chatId: string, parentId: string, model: string) {
  try {
    return await _saveMessage(message, chatId, parentId, model);
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

    return await _fetchChats(payload.user_id);
  } catch(error) {
    console.log(error);
  }

}

export async function fetchMessages(chatId: string) {
  try {
    return await _fetchMessages(chatId);
  } catch(error) {
    console.log(error);
  }
}

export async function renameChat(chatId: string, newName: string) {
  try {
    return await _renameChat(chatId, newName);
  } catch(error) {
    console.log(error);
  }
}
