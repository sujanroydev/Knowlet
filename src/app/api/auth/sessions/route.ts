import { NextRequest, NextResponse } from "next/server";

import { verifyAccessToken } from "@/lib/auth/tokens";

import {
  getActiveAuthSessions,
  revokeAllAuthSessions,
  revokeAuthSessions,
} from "@/db/auth/authSessions";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("access_token")?.value;
    const payload = await verifyAccessToken(accessToken);

    if (!accessToken || !payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = payload.user_id as string;
    const currentSessionId = payload.session_id as string;

    const sessions = await getActiveAuthSessions(userId);

    return NextResponse.json({
      sessions: (sessions ?? []).map((session) => ({
        ...session,
        isCurrent: session.id === currentSessionId,
      })),
    });
  } catch (error) {
    console.error("Get sessions error:", error);

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("access_token")?.value;
    const payload = await verifyAccessToken(accessToken);

    if (!accessToken || !payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await getActiveAuthSessions(payload.user_id);

    if (sessions.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const sessionIds = sessions
      .map((s) => s.id)
      .filter((id) => id !== payload.session_id);

    await revokeAuthSessions(sessionIds);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sign out all sessions error:", error);

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
