import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { getUserByEmail, updatePassword } from "@/db/user";

export async function POST(req: NextRequest) {
  try {
    const { email, password, oldPassword } = await req.json();

    if (!email || !password || !oldPassword) {
      return NextResponse.json(
        { error: { message: "All fields are required" } },
        { status: 400 },
      );
    }

    const user = await getUserByEmail(email);

    if (!user) throw Error("User doesn't exist with this email");

    if (!user.password_hash) {
      return NextResponse.json(
        { error: { message: "Password doesn't exist" } },
        { status: 400 },
      );
    }

    // Verify Password
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);

    if (!isMatch) {
      return NextResponse.json(
        { error: { message: "Invalid Password" } },
        { status: 400 },
      );
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update password
    await updatePassword(email, passwordHash);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: { message: "Something went wrong" }},
      { status: 500 },
    );
  }
}
