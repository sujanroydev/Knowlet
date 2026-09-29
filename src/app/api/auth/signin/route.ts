import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { getPasswordHashByEmail, getUserByEmail } from "@/db/user";
import {
  createAccessToken,
  createRefreshToken,
  hashRefreshToken,
} from "@/lib/auth/tokens";
import { createAuthSession } from "@/db/auth/authSessions";
import { setAuthCookies } from "@/lib/auth/cookies";
import { getClientInfo } from "@/lib/auth/client-info";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: { message: "Email and password required" } },
        { status: 400 },
      );
    }

    const [user, passwordHash] = await Promise.all([
      getUserByEmail(email),
      getPasswordHashByEmail(email),
    ]);

    if (!passwordHash) {
      return NextResponse.json(
        {
          error: {
            message:
              "Password authentication is not available for this account",
          },
        },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, passwordHash);

    if (!isMatch) {
      return NextResponse.json(
        { error: { message: "Invalid credentials" } },
        { status: 401 },
      );
    }

    const refreshToken = createRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);

    const { userAgent, ipAddress } = getClientInfo(req);

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

    const response = NextResponse.json({ user }, { status: 200 });

    setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
