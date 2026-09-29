import { NextRequest, NextResponse } from "next/server";

import { verifyAccessToken } from "@/lib/auth/tokens";
import {
  getActiveAuthSession,
  revokeAuthSession,
} from "@/db/auth/authSessions";

type Params = {
  params: Promise<{
    sessionId: string;
  }>;
};

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const accessToken = request.cookies.get("access_token")?.value;
    const payload = await verifyAccessToken(accessToken);

    if (!accessToken || !payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = payload.user_id as string;
    const currentSessionId = payload.session_id as string;

    const { sessionId } = await params;

    // Prevent the current session from being revoked
    // through the "specific device" endpoint.
    if (sessionId === currentSessionId) {
      return NextResponse.json(
        {
          error: "You cannot sign out the current device from here.",
        },
        { status: 400 },
      );
    }

    const session = await getActiveAuthSession(sessionId, userId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    await revokeAuthSession(sessionId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Sign out session error:", error);

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
