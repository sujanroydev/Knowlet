"use client";

import { useState, useRef } from "react";
import { ArrowUp, Square } from "lucide-react";
import type { Message, Mode } from "@/types/knowva";
import { useKnowva } from "@/context/KnowvaContext";
import { newChat, saveMessage, renameChat, generateChatTitle } from "@/actions/knowva";

export default function NexusInput() {
  const [text, setText] = useState("");

  const {
    chatId,
    parentId,
    mode,
    model,
    messages,
    isResponding,

    setChatId,
    setParentId,
    setChats,
    setMessages,
    setIsResponding,
  } = useKnowva();

  const abortController = useRef<AbortController | null>(null);

  const send = async () => {
    if (!text.trim() || isResponding) return;

    let currentChatId = chatId;
    let currentParentId = parentId;
    const currentText = text;
    const isNewChat = !chatId;

    abortController.current = new AbortController();
    const signal = abortController.current.signal;

    try {
      if (!currentChatId) {
        const chat = await newChat();
        if (!chat) throw new Error("Failed to create chat");
        currentChatId = chat.id;
        setChatId(currentChatId);
      }

      const userMessage = {
        chat_id: currentChatId,
        parent_id: currentParentId,
        role: "user",
        content: text,
        mode,
        model,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      setText("");
      setIsResponding(true);

      const { id: userMessageId } = await saveMessage(userMessage);

      currentParentId = userMessageId;

      if (signal.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }

      const res = await fetch("/api/nexus/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode, model, chatId: currentChatId }),
        signal: signal,
      });

      const { success, type, data, retryAfter } = await res.json();

      if (!success) throw new Error("Failed");

      const knowvaMessage = {
        chat_id: currentChatId,
        parent_id: currentParentId,
        role: "assistant",
        content: data as string || "No Response",
        mode,
        model,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, knowvaMessage]);

      const { id: knowvaMessageId } = await saveMessage(knowvaMessage);

      currentParentId = knowvaMessageId;
      setParentId(currentParentId);
    } catch (err) {
      let systemMessage = {
        chat_id: currentChatId,
        parent_id: currentParentId,
        role: "system",
        content: "Request failed",
        mode,
        model,
        created_at: new Date().toISOString(),
      };

      if (err instanceof DOMException && err.name === "AbortError") {
        systemMessage.content = "Stopped";
      }

      setMessages(prev => [...prev, systemMessage]);
      setText(currentText);

      if (currentChatId && currentParentId) {
        const { id: messageId } = await saveMessage(systemMessage);
        setParentId(messageId);
      }
    } finally {
      abortController.current = null;
      setIsResponding(false);
      if (isNewChat && currentChatId) {
        void updateChatTitle(currentChatId, currentText);
      }
    }
  };

  const stop = () => {
    abortController.current?.abort();
    abortController.current = null;
    setIsResponding(false);
  };

  const updateChatTitle = async (chatId: string, message: string) => {
    const generatedTitle = await generateChatTitle(message);
    const chat = await renameChat(chatId, generatedTitle);
    setChats((prev) => [...(chat ? [chat] : []), ...prev]);
  }

  return (
    <div className="flex gap-2 p-3 border-t border-gray-200 bg-white">
      <textarea
        className="flex-1 bg-gray-100 text-gray-900 p-2 rounded-lg resize-none h-10 outline-none focus:ring-2 focus:ring-blue-400"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        placeholder="Ask Nexus..."
      />

      <button
        onClick={isResponding ? stop : send}
        className="px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        {isResponding
          ? <Square size={18} />
          : <ArrowUp size={18} />
        }
      </button>
    </div>
  );
}
