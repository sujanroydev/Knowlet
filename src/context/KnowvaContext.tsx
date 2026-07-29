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
  onMessageClick?: OnMessageClick;
  setOnMessageClick: Dispatch<SetStateAction<OnMessageClick | undefined>>;
}

const KnowvaContext = createContext<KnowvaState | null>(null);

export function KnowvaProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [onMessageClick, setOnMessageClick] =
    useState<OnMessageClick>();

  return (
    <KnowvaContext.Provider
      value={{ onMessageClick, setOnMessageClick }}
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