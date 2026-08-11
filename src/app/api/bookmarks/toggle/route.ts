import { NextRequest, NextResponse } from "next/server";
import { getBookmark, insertBookmark, deleteBookmark } from "@/db/user/bookmark";
import { authGate } from "@/lib/auth/authGate";

export async function POST(req: NextRequest) {
  try {
    const { resource_id } = await req.json();

    if (!resource_id) {
      return NextResponse.json(
        { error: { message: "Missing resource id" } },
        { status: 400 },
      );
    }

    const { ok, res, payload } = await authGate(req, "jwt");
    if (!ok || !payload) return res;

    const bookmark = await getBookmark(payload.user_id, resource_id);

    if (bookmark) {
      await deleteBookmark(payload.user_id, resource_id);

      return NextResponse.json({ data: { bookmarked: false } });
    }

    await insertBookmark(payload.user_id, resource_id);

    return NextResponse.json({ data: { bookmarked: true } });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
