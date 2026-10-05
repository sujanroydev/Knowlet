"use server";

import { cookies } from "next/headers";

import {
  createAccessToken,
  createRefreshToken,
  hashRefreshToken,
} from "@/lib/auth/tokens";
import {
  getAuthSessionByRefreshTokenHash,
  rotateAuthSession,
} from "@/db/auth/authSessions";

import { getUserById } from "@/db/user";
import { setAuthCookies } from "@/lib/auth/cookies";

const REFRESH_TOKEN_DAYS = 30;

export async function refreshAccessToken(): Promise<boolean> {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) return false;

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const session = await getAuthSessionByRefreshTokenHash(refreshTokenHash);

  if (!session) return false;

  if (session.revoked_at) return false;

  if (new Date(session.expires_at).getTime() <= Date.now()) return false;

  const user = await getUserById(session.user_id);

  if (!user || !user.is_active) return false;

  // Rotate the refresh token.
  const newRefreshToken = createRefreshToken();
  const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  await rotateAuthSession(session.id, newRefreshTokenHash, expiresAt);

  const accessToken = await createAccessToken({
    userId: user.id,
    sessionId: session.id,
    role: user.role,
  });

  setAuthCookies(cookieStore, accessToken, newRefreshToken);

  return true;
}
