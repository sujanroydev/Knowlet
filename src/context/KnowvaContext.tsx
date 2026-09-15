"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import type { Message, Chat, Mode, NewMessage } from "@/types/knowva";

import { DEFAULT_MODEL } from "@/config/ai";

type OnMessageClick = (message: Message) => void;

interface KnowvaState {
  isResponding: boolean;
  chatId: string | null;
  messageId: string | null;
  parentMessageId: string | null;
  model: string;
  mode: Mode;
  currentMessage: NewMessage | null;
  messages: Message[];
  chats: Chat[];

  setIsResponding: Dispatch<SetStateAction<boolean>>;
  setChatId: Dispatch<SetStateAction<string | null>>;
  setMessageId: Dispatch<SetStateAction<string | null>>;
  setParentMessageId: Dispatch<SetStateAction<string | null>>;
  setModel: Dispatch<SetStateAction<string>>;
  setMode: Dispatch<SetStateAction<Mode>>;
  setCurrentMessage: Dispatch<SetStateAction<NewMessage | null>>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  setChats: Dispatch<SetStateAction<Chat[]>>;

  onMessageClick?: OnMessageClick;
  setOnMessageClick: Dispatch<SetStateAction<OnMessageClick | undefined>>;
}

const KnowvaContext = createContext<KnowvaState | null>(null);

export function KnowvaProvider({ children }: { children: ReactNode }) {
  const [isResponding, setIsResponding] = useState(false);

  const [chatId, setChatId] = useState<string | null>(null);
  const [messageId, setMessageId] = useState<string | null>(null);
  const [parentMessageId, setParentMessageId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("chat");
  const [model, setModel] = useState<string>(DEFAULT_MODEL);

  const [currentMessage, setCurrentMessage] = useState<NewMessage | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);

  const [onMessageClick, setOnMessageClick] = useState<OnMessageClick>();

  return (
    <KnowvaContext.Provider
      value={{
        isResponding,
        chatId,
        messageId,
        parentMessageId,
        model,
        mode,
        currentMessage,
        messages,
        chats,

        setIsResponding,
        setChatId,
        setMessageId,
        setParentMessageId,
        setModel,
        setMode,
        setCurrentMessage,
        setMessages,
        setChats,

        onMessageClick,
        setOnMessageClick,
      }}
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
