import { authGate } from "@/lib/auth/authGate";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { ok, res, payload } = await authGate(req, "jwt");
    if (!ok || !payload) return res;

    const db = await connectDb();
    const { data, error } = await db
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Server error" } },
      { status: 500 },
    );
  }
}
