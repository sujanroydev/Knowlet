"use client";

import { useState, useEffect } from "react";
import KnowvaInput from "./KnowvaInput";
import KnowvaChat from "./KnowvaChat";
import KnowvaToolbar from "./KnowvaToolbar";
import type { Message, Mode } from "@/types/knowva";
import { useHeader } from "@/context/HeaderContext";
import KnowvaDrawer from "@/components/knowva/KnowvaDrawer";

export default function KnowvaPage() {
  const { setMode: setTopBarMode } = useHeader();

  useEffect(() => {
    setTopBarMode("knowva");

    return () => {
      setTopBarMode("home");
    };
  }, []);

  return (
    <div className="h-full flex items-center justify-center bg-background">
      <div className="w-full max-w-3xl h-full flex flex-col border border-border rounded-xl bg-card shadow-sm">
        <KnowvaChat />
        <KnowvaToolbar />
        <KnowvaInput />

        <KnowvaDrawer />
      </div>
    </div>
  );
}
