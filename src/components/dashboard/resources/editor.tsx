"use client";

import HtmlEditor from "./html-editor";
import ResourcePreview from "./resource-preview";
import ResourceActions from "./resource-actions";
import ResourceDetails from "./resource-details";
import { useEffect, useMemo, useState } from "react";
import { Resource } from "@/types/resource";
import { useResourceEditor } from "@/context/ResourceEditorContext";
import { useKnowva } from "@/context/KnowvaContext";

export default function ResourceEditor() {
  const [newResource, setNewResource] = useState<Resource>();

  const [preview, setPreview] = useState<boolean>(false);

  const { action, resource, content, details, setContent, setDetails } = useResourceEditor();
  const { setOnMessageClick } = useKnowva();

  useEffect(() => {
    setOnMessageClick(() => (message) => {
      if (message.sender !== "user" && message.mode === "create-resource") {
        try {
          const parsed = JSON.parse(content);

          setContent(parsed.resource);
          setDetails({
            title: parsed.title,
            description: parsed.description,
            target: "",
            type: "",
            slug: "",
            path: "",
          })
        } catch {}
      }
    });

    return () => {
      setOnMessageClick(undefined);
    }
  }, [setOnMessageClick]);

  useEffect(() => {
    setNewResource({
      ...(resource?.id && { id: resource.id }),
      ...details,
      content,
    });
  }, [content, details]);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Create Resource</h1>

          <p className="mt-2 text-sm text-slate-600">
            Paste your HTML note container, preview the rendered output, and
            save it to the database.
          </p>
        </div>

        {/* Editor + Preview */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {preview ? "Live Preview" : "HTML Editor"}
              </h2>

              <p className="text-sm text-slate-500">
                {preview
                  ? "Sanitized rendered note output."
                  : "Paste only the .container HTML."}
              </p>
            </div>

            <button
              onClick={() => setPreview((pre) => !pre)}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              {preview ? "Show Editor" : "Show Preview"}
            </button>
          </div>

          {preview ? (
            <ResourcePreview content={content} />
          ) : (
            <HtmlEditor content={content} setContent={setContent} />
          )}
        </div>

        {/* Resource Form */}
        <ResourceDetails />

        {/* Actions */}
        <ResourceActions action={action} resource={newResource} />
      </div>
    </div>
  );
}
