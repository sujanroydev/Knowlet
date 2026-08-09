import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { getUserIdByEmail } from "@/db/user";
import { upsertOtp } from "@/db/auth/otp";
import { resend } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const { email, type }: { email: string; type: AuthOtpType } =
      await req.json();

    if (!email || !type) {
      return NextResponse.json(
        { error: { message: "Email and type are required" } },
        { status: 400 },
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const userId = await getUserIdByEmail(email);

    if (userId && type === "signup") {
      return NextResponse.json(
        { error: { message: "user already exists" } },
        { status: 400 },
      );
    } else if (
      [
        "set_password",
        "reset_password",
        "change_password",
        "verify_email",
      ].includes(type)
    ) {
      if (!userId) {
        return NextResponse.json(
          { error: { message: "Unauthorized User" } },
          { status: 403 },
        );
      }
    }

    await upsertOtp(email, otpHash, expiresAt);

    let emailHeader = "";
    if (type === "signup") emailHeader = "<h2>Email Verification OTP</h2>";
    else if (type === "set_password")
      emailHeader = "<h2>Password Reset OTP</h2>";

    await resend.emails.send({
      from: "Knowlet Auth <auth@knowlet.in>",
      to: email,
      subject: "Verify Your Email",
      html: `
        <div style="font-family:sans-serif">
          ${emailHeader}
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP expires in 10 minutes.</p>
          <p>If you did not request this, ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Server Error" } },
      { status: 500 },
    );
  }
}
