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

  return session.id as string;
}

export async function getAuthSessionByRefreshTokenHash(
  refreshTokenHash: string,
) {
  const { data: session, error } = await supabase
    .from("auth_sessions")
    .select("id, user_id, expires_at, revoked_at")
    .eq("refresh_token_hash", refreshTokenHash)
    .maybeSingle();

  if (error) throw error;

  return session;
}

export async function getAuthSession(sessionId: string) {
  const { data: session, error } = await supabase
    .from("auth_sessions")
    .select("id, user_id, expires_at, revoked_at")
    .eq("id", sessionId)
    .maybeSingle();

  if (error) throw error;

  return session;
}

export async function getActiveAuthSessions(userId: string) {
  const { data: sessions, error } = await supabase
    .from("auth_sessions")
    .select("id, user_agent, ip_address, created_at, last_used_at, expires_at")
    .eq("user_id", userId)
    .is("revoked_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("last_used_at", {
      ascending: false,
      nullsFirst: false,
    });

  if (error) throw error;

  return sessions;
}

export async function getActiveAuthSession(sessionId: string, userId: string) {
  const { data: session, error } = await supabase
    .from("auth_sessions")
    .select("id")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .is("revoked_at", null)
    .maybeSingle();

  if (error) throw error;

  return session;
}

export async function rotateAuthSession(
  sessionId: string,
  newRefreshTokenHash: string,
  expiresAt: string,
) {
  const { error } = await supabase
    .from("auth_sessions")
    .update({
      refresh_token_hash: newRefreshTokenHash,
      expires_at: expiresAt,
      last_used_at: new Date().toISOString(),
      rotated_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .is("revoked_at", null);

  if (error) throw error;
}

export async function revokeAuthSession(sessionId: string) {
  const { error } = await supabase
    .from("auth_sessions")
    .update({
      last_used_at: new Date().toISOString(),
      revoked_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .is("revoked_at", null);

  if (error) throw error;
}

export async function revokeAuthSessions(sessionIds: string[]) {
  if (sessionIds.length === 0) return;

  const { error } = await supabase
    .from("auth_sessions")
    .update({
      revoked_at: new Date().toISOString(),
    })
    .in("id", sessionIds)
    .is("revoked_at", null);

  if (error) throw error;
}

export async function revokeAllAuthSessions(userId: string) {
  const { error } = await supabase
    .from("auth_sessions")
    .update({
      revoked_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .is("revoked_at", null);

  if (error) throw error;
}
