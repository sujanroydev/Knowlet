import { markNotificationAsRead } from "@/actions/notification";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const { notification_id } = await req.json();

    await markNotificationAsRead(notification_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Server Error" } },
      { status: 500 },
    );
  }
}
