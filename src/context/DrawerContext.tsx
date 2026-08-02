"use client"

import { createContext, useContext, useState } from "react";

interface DrawerState {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DrawerContext = createContext<DrawerState | null>(null);

export function DrawerProvider({ children }: {children: React.ReactNode}) {
  const [open, setOpen] = useState();

  return (
    <DrawerContext.Provider value={{open, setOpen}}>
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const ctx = useContext(DrawerContext);

  if (!ctx) {
    throw new Error("useHeader must be used inside DrawerProvider");
  }

  return ctx;
}
