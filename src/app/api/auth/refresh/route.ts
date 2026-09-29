import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import {
  createAccessToken,
  createRefreshToken,
  hashRefreshToken,
} from "@/lib/auth/tokens";

const REFRESH_TOKEN_DAYS = 30;

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const { data: session, error: sessionError } = await supabase
    .from("auth_sessions")
    .select("id, user_id, expires_at, revoked_at")
    .eq("refresh_token_hash", refreshTokenHash)
    .maybeSingle();

  if (sessionError) {
    console.error("Failed to fetch auth session:", sessionError);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }

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

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, is_active, role")
    .eq("id", session.user_id)
    .maybeSingle();

  if (userError) {
    console.error("Failed to fetch user:", userError);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }

  if (!user || !user.is_active) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rotate the refresh token.
  const newRefreshToken = createRefreshToken();
  const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { error: updateError } = await supabase
    .from("auth_sessions")
    .update({
      refresh_token_hash: newRefreshTokenHash,
      expires_at: expiresAt,
      last_used_at: new Date().toISOString(),
    })
    .eq("id", session.id)
    .is("revoked_at", null);

  if (updateError) {
    console.error("Failed to rotate refresh token:", updateError);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }

  const accessToken = await createAccessToken({
    userId: user.id,
    sessionId: session.id,
    role: user.role,
  });

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });

  response.cookies.set("refresh_token", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60,
  });

  return response;
}
