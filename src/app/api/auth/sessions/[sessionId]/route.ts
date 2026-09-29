import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import { verifyAccessToken } from "@/lib/auth/tokens";

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

    const { data: session, error: findError } = await supabase
      .from("auth_sessions")
      .select("id")
      .eq("id", sessionId)
      .eq("user_id", userId)
      .is("revoked_at", null)
      .maybeSingle();

    if (findError) {
      console.error(findError);

      return NextResponse.json(
        { error: "Failed to find session" },
        { status: 500 },
      );
    }

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const { error } = await supabase
      .from("auth_sessions")
      .update({
        revoked_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .eq("user_id", userId)
      .is("revoked_at", null);

    if (error) {
      console.error("Failed to revoke session:", error);

      return NextResponse.json(
        { error: "Failed to sign out device" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Sign out session error:", error);

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
