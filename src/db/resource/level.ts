import { supabase } from "@/lib/supabase";

export async function insertLevel(newLevel: {
  title: string,
  number: number,
  slug: string,
  path: string,
}) {
  const { data, error } = await supabase
    .from("levels")
    .insert(newLevel)
    .select()
    .single();

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