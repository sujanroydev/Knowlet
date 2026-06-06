"use client";

import { useEffect, useState } from "react";

export default function HtmlEditor({
  content,
  setContent,
}: {
  content?: string;
  setContent: (rowContent: string) => void;
}) {
  const [rowContent, setRowContent] = useState("");

  useEffect(() => {
    if (rowContent) {
      setContent(
        rowContent
          .replaceAll(/\[cite_start\]\s*/g, "")
          .replaceAll(/\s*\[cite: \d+\]/g, "")
          .replaceAll(/\s*\[cite: \d+(, \d+)*\]/g, ""),
      );
    }
  }, [rowContent]);

  useEffect(() => {
    setRowContent(content || "");
  }, [content]);

  return (
    <div className="p-5">
      <textarea
        value={rowContent}
        onChange={(e) => setContent(e.target.value)}
        spellCheck={false}
        className="h-[650px] w-full resize-none rounded-2xl border border-slate-300 bg-slate-950 p-5 font-mono text-sm text-slate-100 outline-none focus:border-blue-500"
      />
    </div>
  );
}
