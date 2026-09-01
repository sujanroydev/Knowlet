import { supabase } from "@/lib/supabase";
import { History } from "@/types/resource";

export async function getHistory(userId: string, limit: number = 100) {
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
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data as unknown as History[];
}

export async function getUserViewHistoryCount(userId: string) {
  const { count, error } = await supabase
    .from("view_history")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) throw error;

  return count ?? 0;
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
    };
  }[];
}

export async function getRecentHistoryPaths(userId: string, from: string) {
  const { data, error } = await supabase
    .from("view_history")
    .select("created_at")
    .eq("user_id", userId)
    .gte("created_at", from)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as unknown as { created_at: string }[];
}

export async function addViewHistory(userId: string, resourceId: string) {
  const { error } = await supabase.rpc("add_view_history", {
    p_user_id: userId,
    p_resource_id: resourceId,
  });

  if (error) throw error;
}
