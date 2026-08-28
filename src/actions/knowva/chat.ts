"use server";

import { generateChatTitle as _generateChatTitle } from "@/services/knowva";
import {
  pinChat as _pinChat,
  archiveChat as _archiveChat,
  newChat as _newChat,
  fetchChats as _fetchChats,
  deleteChat as _deleteChat,
  renameChat as _renameChat,
} from "@/db/knowva/chat";
import { getAuthenticatedUserId } from "@/lib/auth/getAuthenticatedUserId";

export async function generateChatTitle(message: string) {
  return await _generateChatTitle(message);
}

export async function newChat() {
  const userId = await getAuthenticatedUserId();

  return await _newChat(userId);
}

export async function renameChat(chatId: string, newName: string) {
  return await _renameChat(chatId, newName);
}

export async function fetchChats() {
  const userId = await getAuthenticatedUserId();

  return await _fetchChats(userId);
}

export async function deleteChat(chatId: string) {
  return await _deleteChat(chatId);
}

export async function pinChat(chatId: string, pinned: boolean) {
  return await _pinChat(chatId, pinned);
}

export async function archiveChat(chatId: string, archived: boolean) {
  return await _archiveChat(chatId, archived);
}
