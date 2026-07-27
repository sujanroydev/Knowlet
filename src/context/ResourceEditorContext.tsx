"use client";

import { createContext, useContext, useState } from "react";

interface Details {
  title: string;
  description: string;
  target: string;
  type: string;
  slug: string;
  path: string;
}

type EditorState = {
  content: string;
  details: Details;
  setContent: (content: string) => void;
  setDetails: (details: Details) => void;
};

const defaultDetails = {
  title: "",
  description: "",
  target: "",
  type: "",
  slug: "",
  path: "",
};

const ResourceEditorContext = createContext<EditorState | null>(null);

export function ResourceEditorProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<string>("");
  const [details, setDetails] = useState<Details>(defaultDetails);

  return (
    <ResourceEditorContext.Provider value={{ content, details, setContent, setDetails }}>
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
