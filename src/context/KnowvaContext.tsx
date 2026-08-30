"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import type { Message, Chat, Mode, NewMessage } from "@/types/knowva";

import { DEFAULT_MODEL } from "@/config/ai";
import { fetchChats } from "@/actions/knowva";
import { useAuth } from "@/context/AuthContext";

type OnMessageClick = (message: Message) => void;

interface KnowvaState {
  isResponding: boolean;
  chatId: string | null;
  parentId: string | null;
  model: string;
  mode: Mode;
  currentMessage: NewMessage | null;
  messages: Message[];
  chats: Chat[];

  setIsResponding: Dispatch<SetStateAction<boolean>>;
  setChatId: Dispatch<SetStateAction<string | null>>;
  setParentId: Dispatch<SetStateAction<string | null>>;
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
  const [parentId, setParentId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("chat");
  const [model, setModel] = useState<string>(DEFAULT_MODEL);

  const [currentMessage, setCurrentMessage] = useState<NewMessage | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);

  const [onMessageClick, setOnMessageClick] = useState<OnMessageClick>();

  const { user } = useAuth();

  useEffect(() => {
    void (async () => {
      try {
        if (!user || !user.email) return;
        const featcedChats = await fetchChats();
        setChats(featcedChats || []);
      } catch {}
    })();
  }, [user]);

  return (
    <KnowvaContext.Provider
      value={{
        isResponding,
        chatId,
        parentId,
        model,
        mode,
        currentMessage,
        messages,
        chats,

        setIsResponding,
        setChatId,
        setParentId,
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
