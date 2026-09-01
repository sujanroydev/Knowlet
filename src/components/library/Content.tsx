"use client";

import { notFound } from "next/navigation";
import { useEffect } from "react";

import ResourceFooterActions from "./resource-footer-actions";
import { getResourceStyles } from "@/config/resourceThemes";
import ContentAd from "../ads/ContentAd";

import { useTheme } from "@/context/ThemeContext";
import { useHeader } from "@/context/HeaderContext";
import { useReader } from "@/context/ReaderContext";

export default function Content({ resource }: { resource: any }) {
  if (!resource) notFound();
  const { setMode } = useHeader();
  const { setResourceId } = useReader();
  const { resolvedTheme } = useTheme();

  const style = getResourceStyles({ uuid: resource.id, theme: resolvedTheme });

  useEffect(() => {
    setMode("reader");
    setResourceId(resource.id);

    return () => {
      setMode("home");
    };
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:my-10 lg:rounded-2xl lg:border lg:border-border lg:bg-muted lg:p-10 lg:shadow-[0_12px_40px_rgba(23,32,51,0.07)]">
      <div className="mb-8 border-b border-border pb-6">
        <p className="eyebrow">Study resource</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Read at your pace, then save it for later.
        </p>
      </div>

      <article
        className="resource-content break-words text-base leading-8 text-foreground"
        style={style}
        dangerouslySetInnerHTML={{
          __html: resource.content || "",
        }}
      />

      <ContentAd />

      <div className="my-16 flex items-center gap-4">
        <hr className="flex-1 border-border" />
        <span className="text-sm font-medium text-muted-foreground">xxx</span>
        <hr className="flex-1 border-border" />
      </div>

      <ResourceFooterActions />
    </div>
  );
}
