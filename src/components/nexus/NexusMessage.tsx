import type { Ref } from "react";
import { Edit2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useKnowva } from "@/context/KnowvaContext";
import type { Message } from "@/types/knowva";

export default function NexusMessage({
  message,
  messagesRef
}: {
  message: Message;
  messagesRef?: Ref<HTMLDivElement>;
}) {
  const { onMessageClick } = useKnowva();

  return (
    <div
      ref={messagesRef}
      className={`max-w-[75%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${
        message.role === "user"
          ? "bg-blue-500 text-white ml-auto"
          : "bg-white text-gray-800 mr-auto border border-gray-200"
      }`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {message.content}
      </ReactMarkdown>

      <div className="mt-2 flex items-center justify-end gap-2 text-[10px] opacity-70">
        {(message.mode === "create-resource" && message.role === "assistant") && (
          <button
            type="button"
            onClick={() => onMessageClick?.(message)}
            className="rounded-md p-1 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            aria-label="Edit message"
            title="Edit"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
        )}

        <span>{new Date(message.created_at).toLocaleTimeString()}</span>
      </div>
    </div>
  );
}