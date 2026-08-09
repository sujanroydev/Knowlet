import { supabase } from "@/lib/supabase";

export async function updateUserLastAccessedAt(userId: string) {
  const { error } = await supabase
    .from("users")
    .update({ last_accessed_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) throw error;
}
