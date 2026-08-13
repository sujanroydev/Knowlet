import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { insertOtp, deleteOtp } from "@/db/auth/otp";
import { getUserIdByEmail } from "@/db/user";
import { resend } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        {
          error: {
            message: "Email is required",
          },
        },
        { status: 400 },
      );
    }

    const userId = await getUserIdByEmail(email);

    if (!userId) {
      return NextResponse.json({
        success: true,
      });
    }

    // Delete old OTPs
    await deleteOtp(email);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP
    const otpHash = await bcrypt.hash(otp, 10);

    // Expiry: 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Save OTP
    await insertOtp(email, otpHash, expiresAt);

    // Send email
    await resend.emails.send({
      from: "Knowlet Auth <auth@knowlet.in>",
      to: email,
      subject: "Reset your Knowlet password",
      html: `
        <div style="font-family:sans-serif">
          <h2>Password Reset OTP</h2>

          <p>Your OTP is:</p>

          <h1>${otp}</h1>

          <p>This OTP expires in 10 minutes.</p>

          <p>If you did not request this, ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: {
          message: "Something went wrong",
        },
      },
      { status: 500 },
    );
  }
}
