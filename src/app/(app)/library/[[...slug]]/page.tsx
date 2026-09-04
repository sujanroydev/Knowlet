import type { Metadata } from "next";

import Content from "@/components/library/Content";
import Navigator from "@/components/library/Navigator";
import { parseLibraryPath } from "@/components/dashboard/resources/utils";
import AIAssistant from "@/components/knowva/AIAssistant";
import { getResourceByPath } from "@/db/resource";

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

    const description = `Browse study materials for ${[level, subject, paper, type, target].filter(Boolean).join(", ")} on Knowlet.`;

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

  if (
    !slug ||
    slug?.length <= ((slug || [])[0]?.startsWith("semester") ? 4 : 3)
  ) {
    return <Navigator slug={slug} />;
  }

  const resource = await getResourceByPath(slug.join("/"));

  const { level, subject } = parseLibraryPath(slug.join("/"));
  const url = `${BASE_URL}/library/${slug.join("/")}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: resource.title,
    description:
      resource.description ||
      `${resource.title} study material for ${subject || level || "students"}.`,
    url: url,
    educationalLevel: level,
    learningResourceType: "Study Material",
    inLanguage: "en",
    about: subject
      ? {
          "@type": "Thing",
          name: subject,
        }
      : undefined,
    isPartOf: {
      "@type": "WebSite",
      name: "Knowlet",
      url: BASE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <Content resource={resource} />
      <AIAssistant />
    </>
  );
}
