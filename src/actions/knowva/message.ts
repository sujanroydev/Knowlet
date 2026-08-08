"use server";

import type { Message, Mode } from "@/types/knowva";

import {
  saveMessage as _saveMessage,
  fetchMessages as _fetchMessages,
} from "@/db/knowva/message";

export async function saveMessage(message: Message, chatId: string, parentId: string, model: string) {
  try {
    return await _saveMessage(message, chatId, parentId, model);
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
