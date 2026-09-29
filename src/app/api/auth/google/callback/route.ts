import { NextRequest, NextResponse } from "next/server";

import { createAuthSession } from "@/db/auth/authSessions";
import { getUserIdByEmail, createUser, getActiveUserRole } from "@/db/user";
import { getClientInfo } from "@/lib/auth/client-info";
import { setAuthCookies } from "@/lib/auth/cookies";
import {
  createAccessToken,
  createRefreshToken,
  hashRefreshToken,
} from "@/lib/auth/tokens";
import { sendWelcomeEmail } from "@/services/email/send/welcome";
import generateUsername from "@/utils/generateUsername";

export async function GET(req: NextRequest) {
  try {
    const referralCode = req.cookies.get("referral_code")?.value;
    const code = req.nextUrl.searchParams.get("code");
    const state = req.nextUrl.searchParams.get("state");

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    if (state !== "signin" && state !== "signup") {
      return NextResponse.json(
        { error: "Invalid authentication mode" },
        { status: 400 },
      );
    }

    // Exchange code for token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      throw new Error("Failed to exchange Google authorization code");
    }

    const tokenData = await tokenRes.json();

    // Fetch Google user
    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      },
    );

    if (!userRes.ok) {
      throw new Error("Failed to fetch Google user");
    }

    const googleUser = await userRes.json();

    // Find existing user
    const userId = await getUserIdByEmail(googleUser.email);

    const { userAgent, ipAddress } = getClientInfo(req);

    // SIGN IN
    if (state === "signin") {
      if (!userId) {
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL}/signin?error=account_not_found`,
        );
      }

      const role = await getActiveUserRole(userId);

      const refreshToken = createRefreshToken();
      const refreshTokenHash = hashRefreshToken(refreshToken);

      const sessionId = await createAuthSession({
        userId,
        refreshTokenHash,
        userAgent,
        ipAddress,
      });

      const accessToken = await createAccessToken({
        userId,
        sessionId,
        role: role ?? undefined,
      });

      const response = NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);

      setAuthCookies(response, accessToken, refreshToken);

      return response;
    }

    // SIGN UP
    if (userId) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/signin?error=account_exists`,
      );
    }

    const user = await createUser({
      name: googleUser.name,
      email: googleUser.email,
      username: generateUsername(googleUser.name),
      picture: googleUser.picture,
      referrer_code: referralCode ?? undefined,
    });

    const refreshToken = createRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);

    const sessionId = await createAuthSession({
      userId: user.id,
      refreshTokenHash,
      userAgent,
      ipAddress,
    });

    const accessToken = await createAccessToken({
      userId: user.id,
      sessionId,
      role: user.role,
    });

    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/welcome`,
    );

    response.cookies.delete("referral_code");

    setAuthCookies(response, accessToken, refreshToken);

    void sendWelcomeEmail({
      email: googleUser.email,
      name: googleUser.name,
    }).catch(console.error);

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Google authentication failed" },
      { status: 500 },
    );
  }
}
