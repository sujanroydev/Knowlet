"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X, History } from "lucide-react";
import { useState, useEffect } from "react";

import NexusInput from "@/components/nexus/NexusInput";
import NexusChat from "@/components/nexus/NexusChat";
import NexusToolbar from "@/components/nexus/NexusToolbar";
import type { Message, Mode } from "@/types/knowva";
import { ModelSelector } from "@/components/nexus/ModelSelector";
import { useKnowva } from "@/context/KnowvaContext";
import ChatHistoryPopup from "./ChatHistoryPopup";
import { useChatActions } from "@/hooks/knowva/useChatActions";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [mode, setMode] = useState<Mode>("normal");

  const { model, setModel, messages, setMessages } = useKnowva();
  const { loadChats } = useChatActions()

  useEffect(() => {
    loadChats();
  }, []);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed right-5 bottom-20 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition hover:scale-105 hover:bg-blue-700"
        aria-label="Open AI Assistant"
      >
        {open ? <X size={24} /> : <Bot size={24} />}
      </button>

      {/* Chat Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed right-6 bottom-38 z-50 flex h-[400px] w-[350px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Bot size={20} />
                </div>

                <div>
                  <h2 className="font-semibold">Knowlet AI</h2>
                  <p className="text-xs text-green-600">Online</p>
                </div>

                <ModelSelector model={model} setModel={setModel} />
              </div>

              <button
                type="button"
                onClick={() => setShowHistory((prev) => !prev)}
                className="rounded-md p-2 transition hover:bg-gray-100"
                aria-label="Chat history"
              >
                <History size={18} />
              </button>

              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-2 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <ChatHistoryPopup
              open={showHistory}
              onClose={() => setShowHistory(false)}
            />

            <NexusChat messages={messages} />

            <NexusToolbar mode={mode} setMode={setMode} />

            <NexusInput
              mode={mode}
              setMessages={setMessages}
              messages={messages}
              model={model}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}