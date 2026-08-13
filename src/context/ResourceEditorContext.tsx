"use client";

import { createContext, useContext, useState } from "react";
import type { Resource, Action, Details } from "@/types/resource"
import { parseResourcePath } from "@/components/dashboard/resources/utils";

type EditorState = {
  action: Action
  resource?: Resource;
  content: string;
  details: Details;
  setContent: (content: string) => void;
  setDetails: (details: Details) => void;
};

const ResourceEditorContext = createContext<EditorState | null>(null);

export function ResourceEditorProvider({
  children,
  action = "create",
  resource,
}: {
  children: React.ReactNode;
  action?: Action;
  resource?: Resource;
}) {
  let parsedResourcePath = {
    level: "",
    subject: "",
    paper: "",
    target: "",
    type: "",
  } as {
    level: string,
    subject: string,
    paper?: string,
    target: string,
    type: string,
  }

  try {
    const { level, subject, paper, target, type } = parseResourcePath(resource?.path ?? "");
    parsedResourcePath = { level, subject, paper, target, type };
  } catch {}

  const [content, setContent] = useState<string>(resource?.content ?? "");
  const [details, setDetails] = useState<Details>({
    title: resource?.title ?? "",
    description: resource?.description ?? "",

    level: parsedResourcePath?.level ?? "",
    subject: parsedResourcePath?.subject ?? "",
    paper: parsedResourcePath?.paper ?? "",
    target: parsedResourcePath?.target ?? "",
    type: parsedResourcePath?.type ?? "",

    slug: resource?.slug ?? "",
    path: resource?.path ?? "",
  });

  return (
    <ResourceEditorContext.Provider
      value={{ action, resource, content, details, setContent, setDetails }}
    >
      {children}
    </ResourceEditorContext.Provider>
  );
}

export function useResourceEditor() {
  const ctx = useContext(ResourceEditorContext);

  if (!ctx) {
    throw new Error("useResourceEditor must be used inside ResourceEditorProvider");
  }

  return ctx;
}
