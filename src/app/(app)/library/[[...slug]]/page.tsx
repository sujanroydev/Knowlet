import type { Metadata } from "next";

import Content from "@/components/library/Content";
import Navigator from "@/components/library/Navigator";
import { parseLibraryPath } from "@/components/dashboard/resources/utils";

const BASE_URL = "https://knowlet.in";

function formatSlug(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    return {
      title: "Library | Knowlet",
      description: "Browse notes, PYQs, PDFs, and study materials on Knowlet.",
    };
  }

  const { level, subject, paper, type, target } = parseLibraryPath(
    slug.join("/"),
  );
  const url = `${BASE_URL}/library/${slug.join("/")}`;

  // =========================
  // NAVIGATOR PAGES
  // =========================

  if (slug.length <= 4) {
    const title =
      [level, subject, paper, type, target].filter(Boolean).join(" - ") +
      " | Knowlet";

    const description = `Browse study materials for ${slug
      .map(formatSlug)
      .join(", ")} on Knowlet.`;

    return {
      title,
      description,

      alternates: {
        canonical: url,
      },

      openGraph: {
        title,
        description,
        url,
        siteName: "Knowlet",
        type: "website",
      },
    };
  }

  // =========================
  // RESOURCE PAGE
  // =========================

  const title = `${target} ${type} - ${paper ?? subject} ${paper ? subject : ""} ${level} | Knowlet`;
  const description = `Read ${target} ${type} for  ${paper ?? subject} ${paper ? subject : ""} ${level} on Knowlet.`;

  return {
    title,
    description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      siteName: "Knowlet",
      type: "article",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  if (!slug || slug?.length <= 4) {
    return (
      <div>
        <Navigator slug={slug} />
      </div>
    );
  }
  return (
    <div>
      <Content slug={slug} />
    </div>
  );
}
