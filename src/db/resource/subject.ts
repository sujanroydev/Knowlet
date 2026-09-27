import { supabase } from "@/lib/supabase";
import { Subject } from "@/types/resource";
import { NewSubject } from "@/types/resource/subject";

const defaultColumns =
  "id, title, description, path, slug, code, created_at, updated_at";

export async function insertSubject(newSubject: NewSubject) {
  const { data, error } = await supabase
    .from("subjects")
    .insert(newSubject)
    .select(defaultColumns)
    .single();

  if (error) throw error;

  return data as Subject;
}

export async function getSubjects(levelId: string) {
  const { data, error } = await supabase
    .from("subjects")
    .select(defaultColumns)
    .eq("level_id", levelId);

  if (error) throw error;

  return data as Subject[];
}

export async function getSubjectId(slug: string, levelId: string) {
  const { data, error } = await supabase
    .from("subjects")
    .select("id")
    .eq("slug", slug)
    .eq("level_id", levelId)
    .maybeSingle();

  if (error) throw error;

  return data?.id;
}
