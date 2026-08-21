import { NextRequest, NextResponse } from "next/server";

import { authGate } from "@/lib/auth/authGate";
import { getResourceCounts, getUserResourceState } from "@/db/resource";

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

    const [counts, userState] = await Promise.all([
      getResourceCounts(resource_id),
      getUserResourceState(resource_id, payload.user_id),
    ]);

    return NextResponse.json({
      data: { ...(counts ?? {}), ...(userState ?? {}) },
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
