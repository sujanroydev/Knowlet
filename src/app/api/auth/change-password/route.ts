import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDb from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, password, oldPassword } = await req.json();

    if (!email || !password || !oldPassword) {
      return NextResponse.json(
        { error: { message: "All fields are required" } },
        { status: 400 },
      );
    }

    const db = await connectDb();

    // Fatch user
    const { data: user, error: userError } = await db
      .from("users")
      .select("password_hash")
      .eq("email", email)
      .maybeSingle();

    if (userError || !user) throw userError;

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
    const { error: updateError } = await db
      .from("users")
      .update({
        password_hash: passwordHash,
      })
      .eq("email", email);

    if (updateError) {
      console.error(updateError);

      return NextResponse.json(
        {error: {message: "Failed to reset password" }},
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: { message: "Something went wrong" }},
      { status: 500 },
    );
  }
}
