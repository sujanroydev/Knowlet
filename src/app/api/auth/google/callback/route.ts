import { getUserIdByEmail, createUser } from "@/db/user";
import { sendWelcomeEmail } from "@/services/email/send/welcome";
import generateUsername from "@/utils/generateUsername";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

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

    // SIGN IN
    if (state === "signin") {
      if (!userId) {
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL}/signin?error=account_not_found`,
        );
      }

      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const token = await new SignJWT({ user_id: userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(secret);

      const response = NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);

      response.cookies.set("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 15,
      });

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

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ user_id: userId })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(secret);

    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/welcome`,
    );

    response.cookies.delete("referral_code");

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 15,
    });

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
