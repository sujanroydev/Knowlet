import { verifyJwt } from "@/lib/auth";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const payload = await verifyJwt(req.cookies.get("token")?.value);

    if (!payload?.user_id) {
      return NextResponse.json(
        { error: { message: "Unauthorized" } },
        { status: 401 },
      );
    }

    const db = await connectDb();

    const { data: user, error } = await db
      .from("user_duplicata")
      .select("*")
      .eq("id", payload.user_id)
      .maybeSingle();

    if (error) throw new Error(error.message);

    if (!user) {
      return NextResponse.json(
        { error: { message: "User Not Found" } },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Internal Server Error." } },
      { status: 500 },
    );
  }
}
