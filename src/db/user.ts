import { supabase } from "@/lib/supabase";

export async function updateUserLastAccessedAt(userId: string) {
  const { error } = await supabase
    .from("users")
    .update({ last_accessed_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) throw error;
}

export async function createUser(newUser: {
  name: string;
  email: string;
  username: string;
  picture?: string;
}) {
  const { data, error } = await supabase
    .from("users")
    .insert(newUser)
    .select()
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  return data;
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

export async function updatePassword(email: string, newPasswordHash: string) {
  const { error } = await supabase
    .from("users")
    .update({
      password_hash: newPasswordHash,
    })
    .eq("email", email);

  if (error) throw error;
}
