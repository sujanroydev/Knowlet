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
