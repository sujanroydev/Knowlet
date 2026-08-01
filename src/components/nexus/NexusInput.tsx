"use client";

import { useState, useRef } from "react";
import { ArrowUp, Square } from "lucide-react";
import type { Message, Mode } from "@/types/knowva";
import { useKnowva } from "@/context/KnowvaContext";
import { newChat, saveMessage } from "./actions";

export default function NexusInput({
  mode,
  model = "auto",
  messages,
  setMessages,
}: {
  mode: Mode;
  model: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const { chatId, parentId, setChatId, setParentId } = useKnowva();

  const abortController = useRef<AbortController | null>(null);

  const send = async () => {
    if (!text.trim() || loading) return;

    let currentChatId = chatId;
    let currentParentId = parentId;
    const currentText = text;

    try {
      if (!currentChatId) {
        const chat = await newChat();
        currentChatId = chat.id;
        setChatId(currentChatId);
      }

      const userMessage = {
        sender: "user",
        text,
        mode,
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      setText("");
      setLoading(true);

      const { id: userMessageId } = await saveMessage(
        userMessage,
        currentChatId,
        currentParentId,
        model
      );

      currentParentId = userMessageId;

      abortController.current = new AbortController();

      const res = await fetch("/api/nexus/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode, model }),
        signal: abortController.current.signal,
      });

      const { success, type, data, retryAfter } = await res.json();

      if (!success) throw new Error("Failed");

      const knowvaMessage = {
        sender: "assistant",
        text: data as string || "No response",
        mode,
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, knowvaMessage]);

      const { id: knowvaMessageId } = await saveMessage(
        knowvaMessage,
        currentChatId,
        currentParentId,
        model
      );

      currentParentId = knowvaMessageId;
      setParentId(currentParentId);
    } catch (err) {
      let systemMessage = {
        sender: "system",
        text: "Request failed",
        mode,
        time: new Date().toLocaleTimeString(),
      };

      if (err instanceof DOMException && err.name === "AbortError") {
        systemMessage.text = "Stopped";
      }

      setMessages(prev => [...prev, systemMessage]);
      setText(currentText);

      if (currentChatId && currentParentId) {
        const { id: messageId } = await saveMessage(
          systemMessage,
          currentChatId,
          currentParentId,
          model
        );
        setParentId(messageId);
      }
    } finally {
      abortController.current = null;
      setLoading(false);
    }
  };

  const stop = () => {
    abortController.current?.abort();
    abortController.current = null;
    setLoading(false);
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
        placeholder="Ask Nexus..."
      />

      <button
        onClick={loading ? stop : send}
        className="px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        {loading
          ? <Square size={18} />
          : <ArrowUp size={18} />
        }
      </button>
    </div>
  );
}
