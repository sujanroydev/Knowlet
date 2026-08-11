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
