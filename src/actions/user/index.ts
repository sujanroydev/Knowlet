"use server";

import { getUserByEmail, updatePassword } from "@/db/user";
import bcrypt from "bcryptjs";

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
