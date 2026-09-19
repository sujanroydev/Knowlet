import { supabase } from "@/lib/supabase";

const defaultColumns =
  "id, title, description, path, slug, number, created_at, updated_at";

export async function insertLevel(newLevel: {
  title: string;
  number: number;
  slug: string;
  path: string;
}) {
  const { data, error } = await supabase
    .from("levels")
    .insert(newLevel)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getLevels() {
  const { data, error } = await supabase.from("levels").select(defaultColumns);

  if (error) throw error;

  return data;
}

export async function getLevelId(slug: string) {
  const { data, error } = await supabase
    .from("levels")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;

  return data?.id;
}
