"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";

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
    <div ref={chatRef} className="h-full flex-1 overflow-y-auto bg-gray-50 p-4">
      {messages.length === 0 && !currentMessage ? (
        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
          <Image
            src="/icons/knowva/android-chrome-512x512.png"
            alt="Knowva"
            width={72}
            height={72}
            className="mb-5"
          />

          <h2 className="text-xl font-semibold text-gray-900">
            {user ? `Hello, ${user.name}` : "Welcome to Knowva"}
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
            {user
              ? "What would you like to learn or explore today?"
              : "Login to use Knowlet Knowva and start learning with your AI assistant."}
          </p>
        </div>
      ) : (
        <>
          {messages.map((msg: Message, i: number) => (
            <KnowvaMessage key={i} message={msg} />
          ))}

          {currentMessage && (
            <KnowvaMessage key="current-message" message={currentMessage} />
          )}
        </>
      )}
    </div>
  );
}
