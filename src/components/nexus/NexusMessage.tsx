import { Edit2 } from "lucide-react";
import { useResourceEditor } from "@/context/ResourceEditorContext";

export default function NexusMessage({ message }: any) {
  const { setContent, setDetails } = useResourceEditor();

  const isUser = message.sender === "user";
  let content = message.text;
  let title = "";
  let description = "";

  if (!isUser && message.mode === "create-resource") {
    const parsed = JSON.parse(content);
    content = parsed.resource;
  }

  return (
    <div
      className={`max-w-[75%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${
        isUser
          ? "bg-blue-500 text-white ml-auto"
          : "bg-white text-gray-800 mr-auto border border-gray-200"
      }`}
    >
      <p>{content}</p>

      <div className="mt-2 flex items-center justify-end gap-2 text-[10px] opacity-70">
        {(message.mode === "create-resource" && !isUser) && (
          <button
            type="button"
            onClick={() => {
              setContent(content);
              setDetails({
                title,
                description,
                target: "",
                type: "",
                slug: "",
                path: "",
              })
            }}
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