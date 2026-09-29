import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import { verifyAccessToken } from "@/lib/auth/tokens";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("access_token")?.value;
    const payload = await verifyAccessToken(accessToken);

    if (!accessToken || !payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = payload.user_id as string;
    const currentSessionId = payload.session_id as string;

    const { data: sessions, error } = await supabase
      .from("auth_sessions")
      .select(
        `
          id,
          user_agent,
          ip_address,
          created_at,
          last_used_at,
          expires_at
        `,
      )
      .eq("user_id", userId)
      .is("revoked_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("last_used_at", {
        ascending: false,
        nullsFirst: false,
      });

    if (error) {
      console.error("Failed to fetch auth sessions:", error);

      return NextResponse.json(
        { error: "Failed to fetch sessions" },
        { status: 500 },
      );
    }

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
