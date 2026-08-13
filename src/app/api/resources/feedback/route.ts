import { NextRequest, NextResponse } from "next/server";

import { authGate } from "@/lib/auth/authGate";
import { insertFeedback } from "@/db/resource/feedback";

export async function POST(req: NextRequest) {
  try {
    const { feedbackMsg, resourceId } = await req.json();
    const { ok, res, payload } = await authGate(req, "jwt");

    if (!ok || !payload) return res;

    await insertFeedback(payload.user_id, resourceId, feedbackMsg);

    // TODO: update the response body.
    return NextResponse.json({ feedbackMsg, resourceId }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: { message: "Server error" } },
      { status: 500 },
    );
  }
}
