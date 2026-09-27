import { supabase } from "@/lib/supabase";
import { Paper } from "@/types/resource";
import { NewPaper } from "@/types/resource/paper";

const defaultColumns =
  "id, title, description, path, slug, code, created_at, updated_at";

export async function insertPaper(newPaper: NewPaper) {
  const { data, error } = await supabase
    .from("papers")
    .insert(newPaper)
    .select(defaultColumns)
    .single();

  if (error) throw error;

  return data as Paper;
}

export async function getPapers(subjectId: string) {
  const { data, error } = await supabase
    .from("papers")
    .select(defaultColumns)
    .eq("subject_id", subjectId);

  if (error) throw error;

  return data as Paper[];
}

export async function getPaperId(slug: string, subjectId: string) {
  const { data, error } = await supabase
    .from("papers")
    .select("id")
    .eq("slug", slug)
    .eq("subject_id", subjectId)
    .maybeSingle();

  if (error) throw error;

  return data?.id;
}
