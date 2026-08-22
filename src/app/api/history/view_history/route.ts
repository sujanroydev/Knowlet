import { NextRequest, NextResponse } from "next/server";

import { addViewHistory } from "@/db/resource/history";
import { getHistory } from "@/db/user/history";
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

    await addViewHistory(payload.user_id, resource_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Internal Server Error" } },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { ok, res, payload } = await authGate(req, "jwt");
    if (!ok || !payload) return res;

    // select all history for the user
    const history = await getHistory(payload.user_id);

    return NextResponse.json({ data: history });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Internal Server Error" } },
      { status: 500 },
    );
  }
}
