"use client";

import { useDrawer } from "@/context/DrawerContext";
import { useKnowva } from "@/context/KnowvaContext";
import {
  fetchChats,
  fetchMessages,
  pinChat,
  archiveChat,
  deleteChat,
} from "@/actions/knowva";
import { toast } from "sonner";

export function useChatActions() {
  const { setOpen } = useDrawer();
  const {
    chatId: currentChatId,
    setChats,
    setMessages,
    setChatId,
    setParentId,
  } = useKnowva();

  async function loadChat(chatId: string) {
    const messages = await fetchMessages(chatId).catch(() => {
      toast.error("Faild to load the chat");
      return;
    });

    setMessages(messages ?? []);
    setChatId(chatId);
    setParentId(messages?.at(-1)?.id ?? "");
    setOpen(false);
  }

  async function loadChats() {
    const featcedChats = await fetchChats().catch(() => {
      toast.error("Faild to load chats");
      return;
    });

    setChats(featcedChats || []);
  }

  async function createNewChat() {
    setMessages([]);
    setChatId("");
    setParentId("");
    setOpen(false);
  }

  async function pinChatAction(chatId: string, pinned: boolean) {
    await pinChat(chatId, pinned).catch(() => {
      toast.error("Faild to pin chat");
      return;
    });

    setChats((chats) =>
      chats.map((chat) => (chat.id === chatId ? { ...chat, pinned } : chat)),
    );
  }

  async function archiveChatAction(chatId: string, archived: boolean) {
    await archiveChat(chatId, archived).catch(() => {
      toast.error("Faild to archive chat");
      return;
    });

    setChats((chats) => chats.filter((chat) => chat.id !== chatId));
  }

  async function deleteChatAction(chatId: string) {
    await deleteChat(chatId).catch(() => {
      toast.error("Faild to delete chat");
      return;
    });

    setChats((prev) => prev.filter((chat) => chat.id !== chatId));

    if (chatId === currentChatId) {
      setMessages([]);
      setChatId("");
      setParentId("");
    }
  }

  return {
    loadChat,
    loadChats,
    createNewChat,
    pinChatAction,
    archiveChatAction,
    deleteChatAction,
  };
}
