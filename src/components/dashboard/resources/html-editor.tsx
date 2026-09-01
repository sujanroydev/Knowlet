"use client";

import { ChangeEvent } from "react";
import { html as beautifyHtml } from "js-beautify";

export default function HtmlEditor({
  content,
  setContent,
}: {
  content?: string;
  setContent: (rowContent: string) => void;
}) {
  function handleChange(e: ChangeEvent<HTMLTextAreaElement>): void {
    const rowContent = e.target.value;

    const cleanedContent = rowContent
      .replaceAll("```", "")
      .replaceAll(/\[cite_start\]\s*/g, "")
      .replaceAll(/\s*\[cite: \d+\]/g, "")
      .replaceAll(/\s*\[cite: \d+(, \d+)\]/g, "");

    const beautifiedContent = beautifyHtml(cleanedContent, {
      indent_size: 2,
      wrap_line_length: 0,
      preserve_newlines: true,
      max_preserve_newlines: 1,
    });

    setContent(beautifiedContent);
  }

  return (
    <textarea
      value={content}
      onChange={handleChange}
      spellCheck={false}
      className="block box-border h-[650px] w-full resize-none appearance-none border-0 bg-muted p-6 font-mono text-sm leading-normal text-foreground shadow-none outline-none focus:border-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
    />
  );
}
