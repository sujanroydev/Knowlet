"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import { deleteOtp, findOtpByEmail } from "@/db/auth/otp";
import {
  getUserByEmail,
  getUserById,
  updatePassword,
  updateUserLastAccessedAt,
} from "@/db/user";
import { verifyJwt } from "@/lib/auth";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const { ok, reason, payload } = await verifyJwt(token);

  if (!ok) throw new Error(reason);

  const user = await getUserById(payload.user_id);

  if (!user) throw new Error("User not found");

  const { id, password_hash, ...safeUser } = user;

  void updateUserLastAccessedAt(payload.user_id).catch((error) => {
    console.error("Failed to update last accessed time", error);
  });

  return safeUser;
}

export async function setUserPassword({
  email,
  otp,
  password,
}: {
  email: string;
  otp: string;
  password: string;
}) {
  if (!email || !otp || !password) throw new Error("All fields are required");

  const otpObj = await findOtpByEmail(email);

  if (!otpObj) throw new Error("Invalid or expired OTP");

  // Check expiry
  const now = new Date();

  if (now > new Date(otpObj.expires_at)) {
    // Delete expired OTP
    await deleteOtp(email);

    throw new Error("OTP expired");
  }

  // Verify OTP
  const validOtp = await bcrypt.compare(otp, otpObj.otp_hash);

  if (!validOtp) throw new Error("Invalid OTP");

  // Hash new password
  const passwordHash = await bcrypt.hash(password, 10);

  // Update password
  await updatePassword(email, passwordHash);

  // Delete OTP after successful reset
  await deleteOtp(email);
}

export async function changeUserPassword({
  email,
  password,
  oldPassword,
}: {
  email: string;
  password: string;
  oldPassword: string;
}) {
  if (!email || !password || !oldPassword) {
    throw new Error("All fields are required");
  }

  // Fetch User
  const user = await getUserByEmail(email);

  if (!user) throw new Error("User doesn't exist with this email");

  if (!user.password_hash) throw new Error("Password doesn't exist");

  // Verify Password
  const isMatch = await bcrypt.compare(oldPassword, user.password_hash);

  if (!isMatch) throw new Error("Invalid password");

  // Hash new password
  const passwordHash = await bcrypt.hash(password, 10);

  // Update password
  await updatePassword(email, passwordHash);
}

export async function resetUserPassword({
  email,
  otp,
  password,
}: {
  email: string;
  otp: string;
  password: string;
}) {
  if (!email || !otp || !password) {
    throw new Error("All fields are required");
  }

  // Fetch User
  const otpObj = await findOtpByEmail(email);

  if (!otpObj) throw new Error("Invalid or expired OTP");

  // Check expiry
  const now = new Date();

  if (now > new Date(otpObj.expires_at)) {
    // Delete expired OTP
    await deleteOtp(email);

    throw new Error("OTP Expired");
  }

  // Verify OTP
  const validOtp = await bcrypt.compare(otp, otpObj.otp_hash);

  if (!validOtp) throw new Error("Invalid OTP");

  // Hash new password
  const passwordHash = await bcrypt.hash(password, 10);

  // Update password
  await updatePassword(email, passwordHash);

  // Delete OTP after successful reset
  await deleteOtp(email);
}
