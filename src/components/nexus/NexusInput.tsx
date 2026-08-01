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

  const API_URL = "/api/nexus/chat";

  const send = async () => {
    if (!text.trim() || loading) return;

    const userMsg = {
      sender: "user",
      text,
      mode,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setText("");
    setLoading(true);

    let currentChatId = chatId;

    try {
      abortController.current = new AbortController();

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode, model }),
        signal: abortController.current.signal,
      });

      const { success, type, data, retryAfter } = await res.json();

      const aiMsg = {
        sender: "assistant",
        text: data as string || "No response",
        mode,
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (!currentChatId) {
        const chat = await newChat();
        currentChatId = chat.id;
        setChatId(currentChatId);
      }

      const { id: userMsgId } = await saveMessage(
        userMsg,
        currentChatId,
        parentId,
        model
      );

      const { id: aiMsgId } = await saveMessage(
        aiMsg,
        currentChatId,
        userMsgId,
        model
      );

      setParentId(aiMsgId);
    } catch (err) {
      let systemMsg = {
        sender: "system",
        text: "Request failed",
        mode,
        time: new Date().toLocaleTimeString(),
      };

      if (err instanceof DOMException && err.name === "AbortError") {
        systemMsg.text = "Stopped";
      }

      setMessages(prev => [...prev, systemMsg]);

      if (currentChatId && parentId) {
        const { id } = await saveMessage(
          systemMsg,
          currentChatId,
          parentId,
          model
        );
        setParentId(id);
      }
    } finally {
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
