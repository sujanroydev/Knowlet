"use client";

import { createContext, useContext, useState } from "react";

type HeaderState = {
  title: string;
  setTitle: (t: string) => void;
};

const HeaderContext = createContext<HeaderState | null>(null);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState("Home");

  return (
    <HeaderContext.Provider value={{ title, setTitle }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error("useHeader must be used inside HeaderProvider");
  return ctx;
}
