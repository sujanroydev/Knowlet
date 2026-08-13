import { notFound } from "next/navigation";
import type React from "react";
import type { Resource } from "@/types/resource";
import { headingThemes } from "./Navigator/headingThemes";

type ResourceContentProps = {
  resource: Resource;
};

function getThemeIndex(uuid: string) {
  let hash = 0;

  for (let i = 0; i < uuid.length; i++) {
    hash = (hash * 31 + uuid.charCodeAt(i)) >>> 0;
  }

  return hash % headingThemes.length;
}

export default function ResourceContent({
  resource,
}: ResourceContentProps) {
  if (!resource) {
    notFound();
    return <div>Resource Not Found</div>
  }

  const theme = headingThemes[getThemeIndex(resource.id || "any reandj;kldjf;kla")];

  return (
    <article
      className="resource-content"
      style={
        {
          "--h1": theme.h1,
          "--h2": theme.h2,
          "--h3": theme.h3,
          "--h4": theme.h4,
          "--h5": theme.h5,
          "--h6": theme.h6,
          "--accent": theme.accent,
          "--link": theme.link,
          "--link-hover": theme.linkHover,
          "--blockquote": theme.blockquote,
          "--code": theme.code,
          "--hr": theme.hr,
        } as React.CSSProperties
      }
      dangerouslySetInnerHTML={{
        __html: resource.content || "",
      }}
    />
  );
}