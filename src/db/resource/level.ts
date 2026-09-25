import { supabase } from "@/lib/supabase";
import { Level } from "@/types/resource";
import { NewLevel } from "@/types/resource/level";

const defaultColumns =
  "id, title, description, path, slug, number, created_at, updated_at";

export async function insertLevel(newLevel: NewLevel) {
  const { data, error } = await supabase
    .from("levels")
    .insert(newLevel)
    .select(defaultColumns)
    .single();

  if (error) throw error;

  return data as Level;
}

export async function getLevels() {
  const { data, error } = await supabase.from("levels").select(defaultColumns);

  if (error) throw error;

  return data as Level[];
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
