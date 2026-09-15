"use server";

import type { NewMessage, QuizSubmissionMetadata } from "@/types/knowva";

import {
  saveMessage as _saveMessage,
  fetchMessages as _fetchMessages,
  updateMetadata as _updateMetadata,
} from "@/db/knowva/message";

export async function saveMessage(message: NewMessage) {
  return await _saveMessage(message);
}

export async function fetchMessages(chatId: string) {
  return await _fetchMessages(chatId);
}

export async function updateMetadata(
  messageId: string,
  metadata: QuizSubmissionMetadata,
) {
  return await _updateMetadata(messageId, metadata);
}
