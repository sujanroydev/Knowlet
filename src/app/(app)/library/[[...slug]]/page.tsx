import type { Metadata } from "next";

import Content from "@/components/library/Content";
import Navigator from "@/components/library/Navigator";

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

  const url = `${BASE_URL}/library/${slug.join("/")}`;

  // =========================
  // NAVIGATOR PAGES
  // =========================

  if (slug.length <= 4) {
    const title = slug.map(formatSlug).join(" - ") + " | Knowlet";

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

  const unit = formatSlug(slug[4] || "");
  const type = formatSlug(slug[3] || "");
  const paper = formatSlug(slug[2] || "");
  const semester = formatSlug(slug[0] || "");
  const subject = formatSlug(slug[1] || "");

  const title = `${unit} ${type} - ${paper ?? subject} ${paper ? subject : ""} ${semester} | Knowlet`;

  const description = `Read ${unit} ${type} for  ${paper ?? subject} ${paper ? subject : ""} ${semester} on Knowlet.`;

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
