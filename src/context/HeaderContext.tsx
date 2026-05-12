"use client";

import { createContext, useContext, useState } from "react";

type HeaderMode = "home" | "reader" | "auth" | "search";

type HeaderState = {
  mode: HeaderMode;
  setMode: (mode: HeaderMode) => void;
};

const HeaderContext = createContext<HeaderState | null>(null);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<HeaderMode>("home");

  return (
    <HeaderContext.Provider value={{ mode, setMode }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const ctx = useContext(HeaderContext);

  if (!ctx) {
    throw new Error("useHeader must be used inside HeaderProvider");
  }

  return ctx;
}
