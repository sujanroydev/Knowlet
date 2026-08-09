import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findOtpByEmail, deleteOtp } from "@/db/auth/otp";
import { updatePassword } from "@/db/user";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, password } = await req.json();

    if (!email || !otp || !password) {
      return NextResponse.json(
        { error: { message: "All fields are required" } },
        { status: 400 },
      );
    }

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
      return NextResponse.json(
        { error: { message: "Invalid OTP" } },
        { status: 400 },
      );
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update password
    await updatePassword(email, passwordHash);

    // Delete OTP after successful reset
    await deleteOtp(email);

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
