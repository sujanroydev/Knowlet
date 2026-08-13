import { getUserIdByEmail, createUser } from "@/db/user";
import { sendWelcomeEmail } from "@/services/email/send/welcome";
import generateUsername from "@/utils/generateUsername";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
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

    const tokenData = await tokenRes.json();

    // Fetch user
    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    let user = await userRes.json();

    // Sync with Database
    const userId = await getUserIdByEmail(user.email);

    if (userId) {
      user.id = userId;
    } else {
      user = await createUser({
        name: user.name,
        email: user.email,
        username: generateUsername(user.name),
        picture: user.picture,
      });
    }

    // Create JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({ user_id: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("15d")
      .sign(secret);

    const redirectUrl = userId
      ? `${process.env.NEXT_PUBLIC_APP_URL}`
      : `${process.env.NEXT_PUBLIC_APP_URL}/welcome`;

    // Set cookie
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 15,
    });

    if (!userId) {
      void sendWelcomeEmail({ email: user.email, name: user.name }).catch((error) => {
        console.error("Failed to send welcome email:", error);
      });
    }

    return response;
  } catch (error) {
    console.error(error);
  }
}
