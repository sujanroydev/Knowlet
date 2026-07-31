"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { Message } from "@/types/knowva";

type OnMessageClick = (message: Message) => void;

interface KnowvaState {
  chatId: string;
  parentId: string;
  model: string;
  onMessageClick?: OnMessageClick;

  setChatId: Dispatch<SetStateAction<string>>;
  setParentId: Dispatch<SetStateAction<string>>;
  setModel: Dispatch<SetStateAction<string>>;
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
  const [model, setModel] = useState<string>("");
  const [onMessageClick, setOnMessageClick] = useState<OnMessageClick>();

  return (
    <KnowvaContext.Provider
      value={{ chatId, setChatId, parentId, setParentId, model, setModel, onMessageClick, setOnMessageClick }}
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