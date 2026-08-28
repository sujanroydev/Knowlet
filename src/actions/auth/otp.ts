"use server";

import bcrypt from "bcryptjs";

import { getUserIdByEmail } from "@/db/user";
import { upsertOtp } from "@/db/auth/otp";
import { resend } from "@/lib/resend";

export async function sendAuthOtp({
  email: _email,
  type,
}: {
  email: string;
  type: AuthOtpType;
}) {
  const email = (_email as string).toLowerCase();

  if (!email || !type) throw new Error("Email and type are required");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const userId = await getUserIdByEmail(email);

  if (userId && type === "signup") {
    throw new Error("User already exists");
  } else if (
    !userId &&
    [
      "set_password",
      "reset_password",
      "change_password",
      "verify_email",
    ].includes(type)
  ) {
    throw new Error("Unauthorized User");
  }

  await upsertOtp(email, otpHash, expiresAt);

  let emailHeader = "";
  if (type === "signup") {
    emailHeader = "<h2>Email Verification OTP</h2>";
  } else if (type === "set_password") {
    emailHeader = "<h2>Password Reset OTP</h2>";
  }

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
}
