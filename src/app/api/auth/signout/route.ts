import { NextRequest, NextResponse } from "next/server";

import { clearAuthCookies } from "@/lib/auth/cookies";
import { hashRefreshToken } from "@/lib/auth/tokens";

import {
  getAuthSessionByRefreshTokenHash,
  revokeAuthSession,
} from "@/db/auth/authSessions";

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

  await revokeAuthSession(session.id);

  const res = NextResponse.json({ success: true });

  clearAuthCookies(res.cookies);

  return res;
}
