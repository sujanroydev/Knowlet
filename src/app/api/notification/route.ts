import { NextRequest, NextResponse } from "next/server";

import { authGate } from "@/lib/auth/authGate";
import { getAllNotifications } from "@/db/notification";

export async function GET(req: NextRequest) {
  try {
    const { ok, res, payload } = await authGate(req, "jwt");
    if (!ok || !payload) return res;

    const notifications = await getAllNotifications();

    return NextResponse.json({ data: notifications });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Server error" } },
      { status: 500 },
    );
  }
}
