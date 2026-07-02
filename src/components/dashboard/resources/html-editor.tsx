"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { html as beautifyHtml } from "js-beautify";

export default function HtmlEditor({
  content,
  setContent,
}: {
  content?: string;
  setContent: (rowContent: string) => void;
}) {
  function handleChange(
    e: ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>,
  ): void {
    const rowContent = e.target.value;

    const cleanedContent = rowContent
      .replaceAll(/\[cite_start\]\s*/g, "")
      .replaceAll(/\s*\[cite: \d+\]/g, "")
      .replaceAll(/\s*\[cite: \d+(, \d+)*\]/g, "");

    const beautifiedContent = beautifyHtml(cleanedContent, {
      indent_size: 4,
      wrap_line_length: 0,
      preserve_newlines: true,
      max_preserve_newlines: 1,
    });

    setContent(beautifiedContent);
  }

  return (
    <div className="p-5">
      <textarea
        value={content}
        onChange={handleChange}
        spellCheck={false}
        className="h-[650px] w-full resize-none rounded-2xl border border-slate-300 bg-slate-950 p-5 font-mono text-sm text-slate-100 outline-none focus:border-blue-500"
      />
    </div>
  );
}
