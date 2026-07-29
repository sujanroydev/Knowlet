import { Edit2 } from "lucide-react";
import { useKnowva } from "@/context/KnowvaContext";
import type { Message } from "@/types/knowva";

export default function NexusMessage({
  message
}: {
  message: Message
}) {
  const { onMessageClick } = useKnowva();

  const isUser = message.sender === "user";

  return (
    <div
      className={`max-w-[75%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${
        isUser
          ? "bg-blue-500 text-white ml-auto"
          : "bg-white text-gray-800 mr-auto border border-gray-200"
      }`}
    >
      <p>{message.text}</p>

      <div className="mt-2 flex items-center justify-end gap-2 text-[10px] opacity-70">
        {(message.mode === "create-resource" && !isUser) && (
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

        <span>{message.time}</span>
      </div>
    </div>
  );
}