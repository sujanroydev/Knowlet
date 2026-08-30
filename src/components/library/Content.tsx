import { notFound } from "next/navigation";

import { getResourceByPath } from "@/db/resource";
import ReaderPageClient from "./ReaderPageClient";
import ResourceFooterActions from "./resource-footer-actions";
import { resourceThemes, type ResourceTheme } from "@/config/resourceThemes";
import ContentAd from "../ads/ContentAd";

function getThemeIndex(uuid: string) {
  let hash = 0;

  for (let i = 0; i < uuid.length; i++) {
    hash = (hash * 31 + uuid.charCodeAt(i)) >>> 0;
  }

  return hash % resourceThemes.length;
}

export default async function Content({ slug }: { slug: string[] }) {
  const resource = await getResourceByPath(slug.join("/"));

  if (!resource) notFound();

  const theme = resourceThemes[getThemeIndex(resource.id)];

  return (
    <ReaderPageClient resourceId={resource.id}>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:my-10 lg:rounded-2xl lg:border lg:border-border lg:bg-white lg:p-10 lg:shadow-[0_12px_40px_rgba(23,32,51,0.07)]">
        <div className="mb-8 border-b border-border pb-6">
          <p className="eyebrow">Study resource</p>
          <p className="mt-2 text-sm text-muted-foreground">Read at your pace, then save it for later.</p>
        </div>
        <article className="resource-content break-words text-base leading-8 text-slate-800"
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

        <ContentAd />

        <div className="my-16 flex items-center gap-4">
          <hr className="flex-1 border-border" />
          <span className="text-sm font-medium text-muted-foreground">xxx</span>
          <hr className="flex-1 border-border" />
        </div>

        <ResourceFooterActions />
      </div>
    </ReaderPageClient>
  );
}
