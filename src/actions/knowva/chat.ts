"use server";

import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth"

import { generateChatTitle as _generateChatTitle } from "@/services/knowva";
import {
  pinChat as _pinChat,
  archiveChat as _archiveChat,
  newChat as _newChat,
  fetchChats as _fetchChats,
  deleteChat as _deleteChat,
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

export async function renameChat(chatId: string, newName: string) {
  try {
    return await _renameChat(chatId, newName);
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

export async function deleteChat(chatId: string) {
  try {
    return await _deleteChat(chatId);
  } catch(error) {
    console.log(error);
  }
}

export async function pinChat(
  chatId: string,
  pinned: boolean
) {
  try {
    return await _pinChat(chatId, pinned);
  } catch (error) {
    console.log(error);
  }
}

export async function archiveChat(
  chatId: string,
  archived: boolean
) {
  try {
    return await _archiveChat(chatId, archived);
  } catch (error) {
    console.log(error);
  }
}
