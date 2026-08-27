"use server";

import bcrypt from "bcryptjs";

import { insertOtp, deleteOtp } from "@/db/auth/otp";
import { getUserIdByEmail } from "@/db/user";
import { sendPasswordResetEmail } from "@/services/email/send";

export async function sendPasswordResetOtp(email: string) {
  if (!email) throw new Error("Email is required");

  const userId = await getUserIdByEmail(email);

  if (!userId) throw new Error("User not found");

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
  await sendPasswordResetEmail({ email, otp });
}
