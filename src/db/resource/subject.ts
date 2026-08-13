import { supabase } from "@/lib/supabase";

export async function insertSubject(newSubject: {
  level_id: string,
  title: string,
  slug: string,
  path: string,
}) {
  const { data, error } = await supabase
    .from("subjects")
    .insert(newSubject)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getSubjectId(
  slug: string,
  levelId: string,
) {
  const { data, error } = await supabase
    .from("subjects")
    .select("id")
    .eq("slug", slug)
    .eq("level_id", levelId)
    .maybeSingle();

  if (error) throw error;

  return data?.id;
}