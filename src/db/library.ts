import { supabase } from "@/lib/supabase";

type SelectQuery =
  | "*, subjects(title, description, path)"
  | "*, papers(title, description, path)"
  | "*, resources(title, description, path)";

type Table = "levels" | "subjects" | "papers" | "resources";

const tables: Table[] = ["levels", "subjects", "papers", "resources"];

export function getLibraryData(slug?: string[]) {
  const depth = !slug ? 0 : slug.length - 1;

  const currentTable = tables[depth] as Table;
  const nextTable = tables[depth + 1] as Table;

  const academicPattern: "semester" | "class" | null = slug
    ? slug[0].startsWith("semester")
      ? "semester"
      : slug[0].startsWith("class")
        ? "class"
        : null
    : null;

  let query;
  let special = false;

  if (slug) {
    if (academicPattern === "semester" && slug.length >= 3) {
      query = supabase
        .from("resources")
        .select("title, description, path, type, target")
        .like("path", `${slug.join("/")}%`);

      special = true;
    } else if (academicPattern === "class" && slug.length >= 2) {
      query = supabase
        .from("resources")
        .select("title, description, path, type, target")
        .like("path", `${slug.join("/")}%`);

      special = true;
    } else {
      query = supabase
        .from(currentTable)
        .select(`*, ${nextTable}(title, description, path)` as SelectQuery)
        .eq("path", slug.join("/"));
    }
  } else {
    query = supabase
      .from(currentTable)
      .select(`*, ${nextTable}(title, description, path)` as SelectQuery);
  }

  return {
    query,
    nextTable,
    special,
  };
}
