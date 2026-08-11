import { NextRequest, NextResponse } from "next/server";
import { getBookmarks } from "@/db/user/bookmark";
import { authGate } from "@/lib/auth/authGate";

export async function GET(req: NextRequest) {
  try {
    const { ok, res, payload } = await authGate(req, "jwt");
    if (!ok || !payload) return res;

    // select all bookmarks for the user
    const resources = await getBookmarks(payload.user_id);

    return NextResponse.json({ data: resources });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Internal Server Error" } },
      { status: 500 },
    );
  }
}
