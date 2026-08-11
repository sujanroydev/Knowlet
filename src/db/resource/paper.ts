import { supabase } from "@/lib/supabase";

export async function insertPaper(newPaper: {
  subject_id: string;
  level_id: string;
  title: string;
  code: string;
  slug: string;
  path: string;
}) {
  const { data, error } = await supabase
    .from("papers")
    .insert(newPaper)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getPaperId(
  slug: string,
  subjectId: string,
) {
  const { data, error } = await supabase
    .from("papers")
    .select("id")
    .eq("slug", slug)
    .eq("subject_id", subjectId)
    .maybeSingle();

  if (error) throw error;

  return data?.id;
}