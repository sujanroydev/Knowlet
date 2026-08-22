import { notFound } from "next/navigation";

import Header from "./Header";
import Main from "./Main";
import sortByPath from "@/utils/sortByPath";
import { getLibraryData } from "@/db/library";

const tables = ["levels", "subjects", "papers", "resources"];

export default async function Navigator({
  slug,
  variant,
}: {
  slug?: string[];
  variant?: "home" | "library";
}) {
  const { query, nextTable, special } = getLibraryData(slug);

  const { data, error } = await query;

  if (error || !data) {
    if (variant === "home") {
      return (
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-2xl font-semibold text-red-500">
            Failed to load
          </p>
        </div>
      );
    }

    return notFound();
  }

  const title = slug
    ? special
      ? "Resources"
      : data[0].title || tables[slug.length - 1]
    : "Semesters";

  const subtitle = slug
    ? special
      ? "Open any resource to start reading."
      : data[0].description ||
        `Open any ${tables[slug.length].slice(0, -1)} to view more.`
    : "Open any semester to view more.";

  const path = slug ?? [];

  const items = !slug || special ? data : data[0]?.[nextTable];

  return (
    <>
      {variant !== "home" && (
        <Header title={title} subtitle={subtitle} path={path} />
      )}

      <Main items={sortByPath(items)} special={special} />
    </>
  );
}
