import { verifyJwt } from "@/lib/auth";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { feedbackMsg, resourceId } = await req.json();
    const token = req.cookies.get("token")?.value;
    const payload = await verifyJwt(token);

    if (!payload) {
      return NextResponse.json(
        { error: { message: "Unauthorized" } },
        { status: 403 },
      );
    }

    const db = await connectDb();

    const { error } = await db.from("resource_feedback").insert({
      user_id: payload.user_id,
      resource_id: resourceId,
      message: feedbackMsg,
    });

    if (error) throw new Error(error.message);

    return NextResponse.json({ feedbackMsg, resourceId }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: { message: "Server error" } },
      { status: 500 },
    );
  }
}
