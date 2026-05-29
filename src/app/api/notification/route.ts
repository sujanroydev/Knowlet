import { verifyAdmin } from "@/lib/auth";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const admin = verifyAdmin(token);

    if (!admin) {
      return NextResponse.json(
        { error: { message: "Unauthorized" } },
        { status: 403 },
      );
    }

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
