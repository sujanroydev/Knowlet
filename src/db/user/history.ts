import { supabase } from "@/lib/supabase";

export async function getHistory(userId: string) {
  const { data, error } = await supabase
    .from("view_history")
    .select(
      `
        id,
        created_at,
        resource: resources (
          id,
          title,
          description,
          path,
          created_at
        )
      `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function getHistoryPaths(userId: string) {
  const { data, error } = await supabase
    .from("view_history")
    .select("created_at, resource: resources(path)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as unknown as {
    created_at: string;
    resource: {
      path: string;
    }
  }[];
}

export async function getRecentHistoryPaths(
  userId: string,
  from: string,
) {
  const { data, error } = await supabase
    .from("view_history")
    .select("created_at")
    .eq("user_id", userId)
    .gte("created_at", from)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as unknown as { created_at: string }[];
}
