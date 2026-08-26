"use client";

import { useState, useRef } from "react";
import { ArrowUp, Square } from "lucide-react";
import { toast } from "sonner";

import type { Message, NewMessage, Mode } from "@/types/knowva";
import { useKnowva } from "@/context/KnowvaContext";
import { useAuth } from "@/context/AuthContext";
import {
  newChat,
  saveMessage,
  renameChat,
  generateChatTitle,
} from "@/actions/knowva";

export default function KnowvaInput() {
  const [text, setText] = useState("");

  const {
    chatId,
    parentId,
    mode,
    model,
    isResponding,

    setChatId,
    setParentId,
    setCurrentMessage,
    setMessages,
    setChats,
    setIsResponding,
  } = useKnowva();
  const { user } = useAuth();

  const abortController = useRef<AbortController | null>(null);

  const send = async () => {
    if (!text.trim() || isResponding) return;

    let currentChatId = chatId;
    let currentParentId = parentId || null;
    const currentText = text;
    const isNewChat = !chatId;

    abortController.current = new AbortController();
    const signal = abortController.current.signal;

    try {
      if (!user || !user.email) {
        toast.info("Signin is required to use AI Features");
        return;
      }

      if (!currentChatId) {
        const chat = await newChat();
        if (!chat) throw new Error("Failed to create chat");
        currentChatId = chat.id;
        setChatId(currentChatId);
      }

      const userNewMessage = {
        chat_id: currentChatId,
        parent_id: currentParentId,
        role: "user",
        content: text,
        mode,
        model,
      };

      setCurrentMessage(userNewMessage);
      const userMessage = await saveMessage(userNewMessage);

      setCurrentMessage(null);
      setMessages((prev) => [...prev, userMessage]);

      setText("");
      setIsResponding(true);

      currentParentId = userMessage.id;

      if (signal.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }

      const res = await fetch("/api/knowva/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode, model, chatId: currentChatId }),
        signal: signal,
      });

      const { success, type, data, retryAfter } = await res.json();

      if (!success && type === "rate_limit") throw new Error(data);
      if (!success) throw new Error("Response Failed");

      const knowvaNewMessage = {
        chat_id: currentChatId,
        parent_id: currentParentId,
        role: "assistant",
        content: (data as string) || "No Response",
        mode,
        model,
      };

      setCurrentMessage(knowvaNewMessage);

      const knowvaMessage = await saveMessage(knowvaNewMessage);

      setCurrentMessage(null);
      setMessages((prev) => [...prev, knowvaMessage]);

      currentParentId = knowvaMessage.id;
      setParentId(currentParentId);
    } catch (err) {
      const isAbort = err instanceof DOMException && err.name === "AbortError";

      const errorMessage = isAbort
        ? "Stopped"
        : err instanceof Error
          ? err.message
          : "Something went wrong";

      if (!isAbort && currentChatId) {
        const systemNewMessage = {
          chat_id: currentChatId,
          parent_id: currentParentId,
          role: "system",
          content: errorMessage,
          mode,
          model,
        };

        setCurrentMessage(systemNewMessage);
        const systemMessage = await saveMessage(systemNewMessage);

        setCurrentMessage(null);
        setMessages((prev) => [...prev, systemMessage]);

        setParentId(systemMessage.id);
      }

      setText(currentText);

      if (!isAbort) {
        console.error("Knowva request failed:", err);
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
  };

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
        placeholder="Ask Knowva..."
      />

      <button
        onClick={isResponding ? stop : send}
        className="px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        {isResponding ? <Square size={18} /> : <ArrowUp size={18} />}
      </button>
    </div>
  );
}
