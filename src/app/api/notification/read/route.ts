import { NextRequest, NextResponse } from "next/server";

import { authGate } from "@/lib/auth/authGate";
import { markNotificationAsRead } from "@/db/user/notification";

export async function PATCH(req: NextRequest) {
  try {
    const { notification_id } = await req.json();

    const { ok, res, payload } = await authGate(req, "jwt");
    if (!ok || !payload) return res;

    await markNotificationAsRead(payload.user_id, notification_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Server Error" } },
      { status: 500 },
    );
  }
}
