import { supabase } from "@/lib/supabase";

export async function insertResource(newResource: {
  level_id: string;
  subject_id: string;
  paper_id?: string;
  title: string;
  description?: string;
  content: string;
  target: string;
  type: string;
  slug: string;
  path: string;
}) {
  const { data, error } = await supabase
    .from("resources")
    .insert(newResource)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getResources() {
  const { data, error } = await supabase
    .from("resources")
    .select("id, title, description, slug, path");

  if (error) throw error;

  return data;
}

export async function getResourceById(resourceId: string) {
  const { data, error } = await supabase
    .from("resources")
    .select(
      `
        id,
        title,
        description,
        content,
        path,
        target,
        type,
        slug
      `,
    )
    .eq("id", resourceId)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function getResourceByPath(path: string) {
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("path", path)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function updateResource(
  resourceId: string,
  resource: {
    title: string,
    description: string,
    content: string,
  }
) {
  const { data, error } = await supabase
    .from("resources")
    .update({
      ...resource,
      updated_at: new Date().toISOString(),
    })
    .eq("id", resourceId)
    .select("path")
    .single();

  if (error) throw error;

  return data;
}

export async function getMostVisitedResources() {
  const { data, error } = await supabase.rpc("get_most_visited_resources");

  if (error) throw error;

  return data;
}

export async function getRecentlyPublishedResources() {
  const { data, error } = await supabase.rpc("get_recently_published_resources");

  if (error) throw error;

  return data;
}
