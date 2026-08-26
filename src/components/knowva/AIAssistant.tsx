"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, History, SquarePen } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import KnowvaInput from "@/components/knowva/KnowvaInput";
import KnowvaChat from "@/components/knowva/KnowvaChat";
import KnowvaToolbar from "@/components/knowva/KnowvaToolbar";
import { ModelSelector } from "@/components/knowva/ModelSelector";
import ChatHistoryPopup from "./ChatHistoryPopup";
import { useChatActions } from "@/hooks/knowva/useChatActions";
import Image from "next/image";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { createNewChat } = useChatActions();

  const assistantRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (
        assistantRef.current &&
        !assistantRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setShowHistory(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [open]);

  return (
    <div ref={assistantRef}>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={
          open
            ? "fixed right-5 bottom-20 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gray-800 text-white shadow-xl transition hover:scale-105 hover:bg-gray-900"
            : "fixed right-5 bottom-20 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition hover:scale-105"
        }
        aria-label={open ? "Close AI Assistant" : "Open AI Assistant"}
      >
        {open ? (
          <X size={24} />
        ) : (
          <Image
            src="/icons/knowva/android-chrome-512x512.png"
            alt="Knowva"
            width={56}
            height={56}
          />
        )}
      </button>

      {/* Chat Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed right-6 bottom-38 z-50 flex h-100 w-87.5 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/icons/knowva/android-chrome-512x512.png"
                  alt="Knowva"
                  width={72}
                  height={72}
                  className="mb-5 w-10 h-10"
                />

                <div>
                  <h2 className="font-semibold">Knowlet AI</h2>
                  <p className="text-xs text-green-600">Online</p>
                </div>

                <ModelSelector />
              </div>

              {/* Right */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => createNewChat()}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium"
                >
                  <SquarePen className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowHistory((prev) => !prev)}
                  className="rounded-md p-2 transition hover:bg-gray-100"
                  aria-label="Chat history"
                >
                  <History size={18} />
                </button>
              </div>
            </header>

            <ChatHistoryPopup
              open={showHistory}
              onClose={() => setShowHistory(false)}
            />

            <KnowvaChat />
            <KnowvaToolbar />
            <KnowvaInput />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
