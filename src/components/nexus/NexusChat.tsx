"use client"

import { useRef, useLayoutEffect } from "react";

import NexusMessage from "./NexusMessage";
import type { Message } from "@/types/knowva";
import { useKnowva } from "@/context/KnowvaContext";
import { useAuth } from "@/context/AuthContext";

export default function NexusChat() {
  const messagesRef = useRef<HTMLDivElement>(null);
  const { messages } = useKnowva();
  const { user } = useAuth();

  useLayoutEffect(() => {
    messagesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  return (
    <div className="h-full flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
      {messages.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          {user
            ? `Hello, ${user.name}`
            : "Login to use Knowlet Knowva"}
        </p>
      )}

      {messages.map((msg: Message, i: number) => (
        <NexusMessage
          key={i}
          message={msg}
          messagesRef={i === messages.length - 1 ? messagesRef : undefined}
        />
      ))}
    </div>
  );
}
