import { supabase } from "@/lib/supabase";

export async function updateUserLastAccessedAt(userId: string) {
  const { error } = await supabase
    .from("users")
    .update({ last_accessed_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) throw error;
}

export async function getUserIdByEmail(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;

  return data?.id as string;
}
