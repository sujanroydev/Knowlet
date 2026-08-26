"use client";

import { useRef, useLayoutEffect } from "react";

import KnowvaMessage from "./KnowvaMessage";
import type { Message } from "@/types/knowva";
import { useKnowva } from "@/context/KnowvaContext";
import { useAuth } from "@/context/AuthContext";

export default function KnowvaChat() {
  const chatRef = useRef<HTMLDivElement>(null);
  const { currentMessage, messages } = useKnowva();
  const { user } = useAuth();

  useLayoutEffect(() => {
    const chat = chatRef.current;
    if (!chat) return;

    const distanceFromBottom =
      chat.scrollHeight - chat.scrollTop - chat.clientHeight;

    // if (distanceFromBottom <= 120) {
    chat.scrollTop = chat.scrollHeight;
    // }
  }, [messages, currentMessage?.content]);

  return (
    <div
      ref={chatRef}
      className="h-full flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50"
    >
      {messages.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          {user ? `Hello, ${user.name}` : "Login to use Knowlet Knowva"}
        </p>
      )}

      {messages.map((msg: Message, i: number) => (
        <KnowvaMessage key={i} message={msg} />
      ))}

      {currentMessage && (
        <KnowvaMessage key="current-message" message={currentMessage} />
      )}
    </div>
  );
}
