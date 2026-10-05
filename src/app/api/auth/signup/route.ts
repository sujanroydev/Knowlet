import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { findOtpByEmail, deleteOtp } from "@/db/auth/otp";
import { createUser } from "@/db/user";
import { sendWelcomeEmail } from "@/services/email/send/welcome";
import generateUsername from "@/utils/generateUsername";
import {
  createAccessToken,
  createRefreshToken,
  hashRefreshToken,
} from "@/lib/auth/tokens";
import { createAuthSession } from "@/db/auth/authSessions";
import { setAuthCookies } from "@/lib/auth/cookies";
import { getClientInfo } from "@/lib/auth/client-info";

export async function POST(request: NextRequest) {
  try {
    const referralCode = request.cookies.get("referral_code")?.value;
    const { name, email: _email, otp, password } = await request.json();
    const email = (_email as string).toLowerCase();
    const username = generateUsername(name);

    if (!name || !email || !otp || !password || !username) {
      return NextResponse.json(
        { error: { message: "All fields are required" } },
        { status: 401 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: { message: "password must be at least 6 characters!" } },
        { status: 400 },
      );
    }

    // Find latest OTP record
    const otpObj = await findOtpByEmail(email);

    if (!otpObj) {
      return NextResponse.json(
        { error: { message: "Invalid or expired OTP" } },
        { status: 400 },
      );
    }

    // Check expiry
    const now = new Date();

    if (now > new Date(otpObj.expires_at)) {
      // Delete expired OTP
      await deleteOtp(email);

      return NextResponse.json(
        { error: { message: "OTP expired" } },
        { status: 400 },
      );
    }

    // Verify OTP
    const validOtp = await bcrypt.compare(otp, otpObj.otp_hash);

    if (!validOtp) {
      // Delete expired OTP
      await deleteOtp(email);

      return NextResponse.json(
        { error: { message: "Invalid OTP" } },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
      name,
      email,
      username,
      password_hash: hashedPassword,
      referrer_code: referralCode ?? undefined,
    });

    const refreshToken = createRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);

    const { userAgent, ipAddress } = getClientInfo(request);

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

    const response = NextResponse.json({ user }, { status: 201 });

    response.cookies.delete("referral_code");

    setAuthCookies(response.cookies, accessToken, refreshToken);

    void sendWelcomeEmail({ email, name }).catch((error) => {
      console.error("Failed to send welcome email:", error);
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
