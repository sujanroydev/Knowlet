import { supabase } from "@/lib/supabase";

export async function getRecentViewHistory(
  prefix: string,
  from: string,
) {
  const { data, error } = await supabase
    .from("view_history")
    .select(
      `
        user_id,
        resources!inner (
          path
        )
      `,
    )
    .ilike("resources.path", `${prefix}%`)
    .gte("created_at", from);

  if (error) throw error;

  return data;
}

export async function addViewHistory(
  userId: string,
  resourceId: string,
) {
  const { error } = await supabase.rpc("add_view_history", {
    p_user_id: userId,
    p_resource_id: resourceId,
  });

  if (error) throw error;
}
