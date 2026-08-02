"use client";

import { useDrawer } from "@/context/DrawerContext";
import { useKnowva } from "@/context/KnowvaContext";
import { fetchMessages, removeChat } from "./actions";

export function useDrawerActions() {
  const { setOpen } = useDrawer();
  const {
    chatId: currentChatId,
    setChats,
    setMessages,
    setChatId,
    setParentId,
  } = useKnowva();

  const loadMessages = async (chatId: string) => {
    const messages = await fetchMessages(chatId);

    setMessages(messages ?? []);
    setChatId(chatId);
    setParentId(messages?.at(-1)?.id ?? "");
    setOpen(false);
  };

  const deleteChat = async (chatId: string) => {
    await removeChat(chatId);

    setChats(prev => prev.filter(chat => chat.id !== chatId));

    if (chatId === currentChatId) {
      setMessages([]);
      setChatId("");
      setParentId("");
    }
  };

  const createNewChat = () => {
    setMessages([]);
    setChatId("");
    setParentId("");
    setOpen(false);
  };

  return {
    loadMessages,
    deleteChat,
    createNewChat,
  };
}