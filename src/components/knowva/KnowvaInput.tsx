"use client";

import { useState, useRef } from "react";
import { ArrowUp, Square } from "lucide-react";
import { toast } from "sonner";

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

      setText("");
      setCurrentMessage(userNewMessage);
      const userMessage = await saveMessage(userNewMessage);

      setCurrentMessage(null);
      setMessages((prev) => [...prev, userMessage]);

      setIsResponding(true);

      currentParentId = userMessage.id;

      if (signal.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }

      let knowvaNewMessage = {
        chat_id: currentChatId,
        parent_id: currentParentId,
        role: "assistant",
        content: "",
        mode,
        model,
      };

      const res = await fetch("/api/knowva/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode, model, chatId: currentChatId }),
        signal,
      });

      if (!res.ok || !res.body) {
        const { type, error } = await res.json();

        if (type === "rate_limit") throw new Error(error);

        throw new Error("Response Failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, {
          stream: true,
        });

        knowvaNewMessage = {
          ...knowvaNewMessage,
          content: knowvaNewMessage.content + chunk,
        };
        setCurrentMessage({ ...knowvaNewMessage });
      }

      const remainingText = decoder.decode();
      if (remainingText) {
        knowvaNewMessage = {
          ...knowvaNewMessage,
          content: knowvaNewMessage.content + remainingText,
        };
        setCurrentMessage({ ...knowvaNewMessage });
      }

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
        className={`flex h-10 w-10 items-center justify-center rounded-xl border backdrop-blur-md transition-all active:scale-90 ${
          isResponding
            ? "border-red-200 bg-red-50/80 text-red-500 hover:bg-red-100"
            : "border-blue-200 bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600"
        }`}
      >
        {isResponding ? (
          <Square size={14} fill="currentColor" />
        ) : (
          <ArrowUp size={19} strokeWidth={2.5} />
        )}
      </button>
    </div>
  );
}
