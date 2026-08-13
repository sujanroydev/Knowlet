import { supabase } from "@/lib/supabase";

export async function createDownload(resourceId: string, userId: string) {
  const { data, error } = await supabase
    .from("resource_downloads")
    .insert({
      resource_id: resourceId,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getDownloads(resourceId: string) {
  const { data, error } = await supabase
    .from("resource_downloads")
    .select("*")
    .eq("resource_id", resourceId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function getDownloadCount(resourceId: string) {
  const { count, error } = await supabase
    .from("resource_downloads")
    .select("id", { count: "exact", head: true })
    .eq("resource_id", resourceId);

  if (error) throw error;

  return count ?? 0;
}

export async function getUserDownloadCount(userId: string) {
  const { count, error } = await supabase
    .from("resource_downloads")
    .select("resource_id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) throw error;

  return count ?? 0;
}

export async function hasDownloaded(
  resourceId: string,
  userId: string
) {
  const { data, error } = await supabase
    .from("resource_downloads")
    .select("id")
    .eq("resource_id", resourceId)
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}
