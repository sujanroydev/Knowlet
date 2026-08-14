"use server";

import type { Message, Mode } from "@/types/knowva";

import {
  saveMessage as _saveMessage,
  fetchMessages as _fetchMessages,
} from "@/db/knowva/message";

export async function saveMessage(message: Message, chatId: string, parentId: string, model: string) {
  return await _saveMessage(message, chatId, parentId, model);
}

export async function fetchMessages(chatId: string) {
  return await _fetchMessages(chatId);
}
