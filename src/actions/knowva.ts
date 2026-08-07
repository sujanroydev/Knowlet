"use server";

import {
  pinChat as _pinChat,
  archiveChat as _archiveChat,
} from "@/db/knowva/chat";

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
