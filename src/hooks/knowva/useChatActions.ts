"use client";

import { useKnowva } from "@/context/KnowvaContext";
import { pinChat, archiveChat } from "@/actions/knowva";

export function useChatActions() {
  const { setChats } = useKnowva();

  async function pinChatAction(chatId: string, pinned: boolean) {
    await pinChat(chatId, pinned);

    setChats((chats) =>
      chats.filter((chat) => chat.id !== chatId)
    );
  }

  async function archiveChatAction(chatId: string, archived: boolean) {
    await archiveChat(chatId, archived);

    setChats((chats) =>
      chats.filter((chat) => chat.id !== chatId)
    );
  }

  return {
    pinChatAction,
    archiveChatAction,
  };
}