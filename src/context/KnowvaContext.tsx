"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { Message, Chat } from "@/types/knowva";

type OnMessageClick = (message: Message) => void;

interface KnowvaState {
  chatId: string;
  parentId: string;
  model: string;
  messages: Message[];
  chats: Chat[];


  setChatId: Dispatch<SetStateAction<string>>;
  setParentId: Dispatch<SetStateAction<string>>;
  setModel: Dispatch<SetStateAction<string>>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  setChats: Dispatch<SetStateAction<Chat[]>>;

  onMessageClick?: OnMessageClick;
  setOnMessageClick: Dispatch<SetStateAction<OnMessageClick | undefined>>;
}

const KnowvaContext = createContext<KnowvaState | null>(null);

export function KnowvaProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [chatId, setChatId] = useState<string>("");
  const [parentId, setParentId] = useState<string>("");
  const [model, setModel] = useState<string>("auto");

  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [onMessageClick, setOnMessageClick] = useState<OnMessageClick>();

  return (
    <KnowvaContext.Provider
      value={{
        chatId,
        parentId,
        model,
        messages,
        chats,

        setChatId,
        setParentId,
        setModel,
        setMessages,
        setChats,

        onMessageClick,
        setOnMessageClick }}
    >
      {children}
    </KnowvaContext.Provider>
  );
}

export function useKnowva() {
  const ctx = useContext(KnowvaContext);

  if (!ctx) {
    throw new Error("useKnowva must be used inside KnowvaProvider");
  }

  return ctx;
}