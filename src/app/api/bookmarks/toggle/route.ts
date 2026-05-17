import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import { verifyJwt } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { resource_id } = await req.json();

    if (!resource_id) {
      return NextResponse.json(
        { error: { message: "Missing resource id" } },
        { status: 400 },
      );
    }

    const payload = await verifyJwt(req.cookies.get("token")?.value);

    if (!payload?.user_id) {
      return NextResponse.json(
        { error: { message: "Unauthorized" } },
        { status: 401 },
      );
    }

    const db = await connectDb();

    // check existing bookmarks
    const { data, error } = await db
      .from("bookmarks")
      .select("id")
      .eq("user_id", payload?.user_id)
      .eq("resource_id", resource_id)
      .maybeSingle();

    if (error) throw new Error(error?.message);

    // bookmark
    if (data) {
      const { error } = await db
        .from("bookmarks")
        .delete()
        .eq("user_id", payload?.user_id)
        .eq("resource_id", resource_id);

      if (error) throw new Error(error.message);
      return NextResponse.json({ data: { bookmarked: false } });
    }

    // remove bookmarks
    const { error: insertError } = await db.from("bookmarks").insert({
      user_id: payload?.user_id,
      resource_id,
    });

    if (insertError) throw new Error(insertError.message);

    return NextResponse.json({ data: { bookmarked: true } });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
