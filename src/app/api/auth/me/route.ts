import { verifyJwt } from "@/lib/auth";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const { ok, payload, reason } = await verifyJwt(token);

    if (!ok) {
      const res = NextResponse.json(
        { error: { message: reason } },
        { status: 401 },
      );
      res.cookies.set("token", "", { maxAge: 0 });
      return res;
    }

    const db = await connectDb();

    const { data: user, error } = await db
      .from("users")
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

    delete user.id;
    delete user.password_hash;

    return NextResponse.json({ data: user });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Internal Server Error." } },
      { status: 500 },
    );
  }
}
