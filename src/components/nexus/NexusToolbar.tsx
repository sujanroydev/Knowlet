"use client";

import { usePathname } from "next/navigation";

export default function NexusToolbar({ mode, setMode }: any) {
  const pathname = usePathname();

  const modes = ["study", "short", "explain", ...(pathname.endsWith("create") ? ["create-resource"] : []),];

  return (
    <div className="flex gap-2 px-2 py-2 overflow-x-auto whitespace-nowrap border-t border-gray-200 bg-white">
      {modes.map((m) => (
        <button
          key={m}
          onClick={() => setMode(mode === m ? "normal" : m)}
          className={`px-3 rounded-lg text-sm border transition shrink-0 ${
            mode === m
              ? "bg-blue-100 border-blue-400"
              : "border-gray-200 hover:bg-gray-100"
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
