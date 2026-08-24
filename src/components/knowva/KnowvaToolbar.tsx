"use client";

import { usePathname } from "next/navigation";

import { Mode } from "@/types/knowva";
import { useKnowva } from "@/context/KnowvaContext";

export default function KnowvaToolbar() {
  const pathname = usePathname();
  const { mode, setMode } = useKnowva();

  const modes: Mode[] = [
    "study",
    "short",
    "explain",
    ...(pathname.endsWith("create") ? (["create-resource"] as Mode[]) : []),
  ];

  return (
    <div className="flex gap-2 px-2 py-2 overflow-x-auto whitespace-nowrap border-t border-gray-200 bg-white">
      {modes.map((m) => (
        <button
          key={m}
          onClick={() => setMode(mode === m ? "chat" : m)}
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
