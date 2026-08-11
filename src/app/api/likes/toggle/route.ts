import { NextRequest, NextResponse } from "next/server";
import { insertLike, isLiked, deleteLike} from "@/db/user/like";
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

    const liked = await isLiked(payload.user_id, resource_id);

    if (liked) {
      await deleteLike(payload.user_id, resource_id);

      return NextResponse.json({ data: { liked: false } });
    }

    await insertLike(payload.user_id, resource_id);

    return NextResponse.json({ data: { liked: true } });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
