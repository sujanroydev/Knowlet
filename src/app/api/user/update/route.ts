import { apiError } from "@/lib/api-response";
import { authGate } from "@/lib/auth/authGate";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ok, res, payload } = await authGate(req, "user");

    if (!ok) return res;

    const db = await connectDb();
    const { data: user, error } = await db
      .from("users")
      .update({
        name: body.name,
        picture: body.picture,
        age: body.age,
        stream: body.stream,
        standard: body.standard,
        fav_subject: body.fav_subject,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payload?.user_id)
      .select()
      .maybeSingle();

    if (error) throw error;

    delete user.id;
    delete user.password_hash;

    return NextResponse.json({ data: user });
  } catch (error) {
    return apiError("Server Error", 500);
  }
}
