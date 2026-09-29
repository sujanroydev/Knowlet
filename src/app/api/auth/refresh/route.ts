import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const session = await getAuthSessionByRefreshTokenHash(refreshTokenHash);

  if (!session) {
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 },
    );
  }

  if (session.revoked_at) {
    return NextResponse.json(
      { error: "Session has been revoked" },
      { status: 401 },
    );
  }

  if (new Date(session.expires_at).getTime() <= Date.now()) {
    return NextResponse.json(
      { error: "Refresh token has expired" },
      { status: 401 },
    );
  }

  const user = await getUserById(session.user_id);

  if (!user || !user.is_active) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  const response = NextResponse.json({ success: true });

  setAuthCookies(response, accessToken, newRefreshToken);

  return response;
}
