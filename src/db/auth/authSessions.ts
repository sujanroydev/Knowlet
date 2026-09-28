import { supabase } from "@/lib/supabase";

export async function createAuthSession({
  userId,
  refreshTokenHash,
  userAgent,
  ipAddress,
}: {
  userId: string;
  refreshTokenHash: string;
  userAgent?: string | null;
  ipAddress?: string | null;
}) {
  const { data: session, error } = await supabase
    .from("auth_sessions")
    .insert({
      user_id: userId,
      refresh_token_hash: refreshTokenHash,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      last_used_at: new Date().toISOString(),
      user_agent: userAgent,
      ip_address: ipAddress,
    })
    .select("id")
    .single();

  if (error) throw error;

  return session;
}
