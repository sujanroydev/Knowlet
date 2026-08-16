"use client";

import { useState, useEffect } from "react";
import NexusInput from "./NexusInput";
import NexusChat from "./NexusChat";
import NexusToolbar from "./NexusToolbar";
import type { Message, Mode } from "@/types/knowva";
import { useHeader } from "@/context/HeaderContext";
import KnowvaDrawer from "@/components/nexus/KnowvaDrawer";

export default function NexusPage() {
  const { setMode: setTopBarMode } = useHeader();

  useEffect(() => {
    setTopBarMode("knowva");

    return () => {
      setTopBarMode("home");
    };
  }, []);

  return (
    <div className="h-full flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl h-full flex flex-col border border-gray-200 rounded-xl bg-white shadow-sm">
        <NexusChat />
        <NexusToolbar />
        <NexusInput />

        <KnowvaDrawer />
      </div>
    </div>
  );
}
