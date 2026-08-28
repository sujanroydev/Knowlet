"use server";

import type { NewMessage } from "@/types/knowva";

import {
  saveMessage as _saveMessage,
  fetchMessages as _fetchMessages,
} from "@/db/knowva/message";

export async function saveMessage(message: NewMessage) {
  return await _saveMessage(message);
}

export async function fetchMessages(chatId: string) {
  return await _fetchMessages(chatId);
}
