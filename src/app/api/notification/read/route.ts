import { authGate } from "@/lib/auth/authGate";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const { notification_id } = await req.json();

    const { ok, res, payload } = await authGate(req, "jwt");
    if (!ok || !payload) return res;

    const db = await connectDb();

    const { error } = await db
      .from("user_notifications")
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq("notification_id", notification_id)
      .eq("user_id", payload.user_id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Server Error" } },
      { status: 500 },
    );
  }
}
