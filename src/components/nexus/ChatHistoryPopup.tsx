"use client";

import { AnimatePresence, motion } from "framer-motion";
import { History, MessageSquare, Plus, X } from "lucide-react";

interface ChatHistoryPopupProps {
  open: boolean;
  onClose: () => void;
}

const demoChats = [
  {
    id: "1",
    title: "Explain recursion in simple terms",
    date: "Today",
  },
  {
    id: "2",
    title: "Create notes for DBMS",
    date: "Today",
  },
  {
    id: "3",
    title: "What is normalization?",
    date: "Yesterday",
  },
  {
    id: "4",
    title: "Operating System important questions",
    date: "Aug 12",
  },
  {
    id: "5",
    title: "Prepare me for the semester exam",
    date: "Aug 10",
  },
];

export default function ChatHistoryPopup({
  open,
  onClose,
}: ChatHistoryPopupProps) {
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
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <History size={18} />

              <div>
                <h3 className="text-sm font-semibold">
                  Chat History
                </h3>

                <p className="text-xs text-gray-500">
                  Your recent conversations
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-2 transition hover:bg-gray-100"
              aria-label="Close chat history"
            >
              <X size={17} />
            </button>
          </div>

          {/* New Chat */}
          <div className="border-b border-gray-100 p-3">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
            >
              <Plus size={16} />
              New Chat
            </button>
          </div>

          {/* Chats */}
          <div className="flex-1 overflow-y-auto p-2">
            {demoChats.map((chat) => (
              <button
                key={chat.id}
                type="button"
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
                    {chat.date}
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