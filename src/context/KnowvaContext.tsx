"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import type {
  Message,
  Chat,
  Mode,
} from "@/types/knowva";

type OnMessageClick = (message: Message) => void;

interface KnowvaState {
  isResponding: boolean;
  chatId: string | null;
  parentId: string | null;
  model: string;
  mode: Mode;
  messages: Message[];
  chats: Chat[];

  setIsResponding: Dispatch<SetStateAction<boolean>>;
  setChatId: Dispatch<SetStateAction<string | null>>;
  setParentId: Dispatch<SetStateAction<string | null>>;
  setModel: Dispatch<SetStateAction<string>>;
  setMode: Dispatch<SetStateAction<Mode>>;
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
  const [isResponding, setIsResponding] = useState(false);

  const [chatId, setChatId] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("chat");
  const [model, setModel] = useState<string>("auto");

  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [onMessageClick, setOnMessageClick] = useState<OnMessageClick>();

  return (
    <KnowvaContext.Provider
      value={{
        isResponding,
        chatId,
        parentId,
        model,
        mode,
        messages,
        chats,

        setIsResponding,
        setChatId,
        setParentId,
        setModel,
        setMode,
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