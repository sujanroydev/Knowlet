"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X } from "lucide-react";
import { useEffect } from "react";

import { useKnowva } from "@/context/KnowvaContext";
import { useChatActions } from "@/hooks/knowva/useChatActions";

interface ChatHistoryPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatHistoryPopup({
  open,
  onClose,
}: ChatHistoryPopupProps) {
  const { chats } = useKnowva();
  const { loadChat, loadChats } = useChatActions();

  useEffect(() => {
    if (chats.length) return;
    loadChats();
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-x-0 top-0 z-30 flex h-full flex-col bg-white"
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-900">
              Recent Chats
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat history"
              className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <X size={17} />
            </button>
          </header>

          {/* Chats */}
          <div className="flex-1 overflow-y-auto p-2">
            {chats.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => {
                  loadChat(chat.id);
                  onClose();
                }}
                className="group flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-gray-100"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 group-hover:bg-white">
                  <MessageSquare size={15} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {chat.title}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {chat.last_message_at}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
