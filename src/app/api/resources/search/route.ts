import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("query");

    const words = query?.trim().split(/\s+/).filter(Boolean) ?? [];

    const conditions = words.flatMap((word) => [
      `title.ilike.%${word}%`,
      `description.ilike.%${word}%`,
      `path.ilike.%${word}%`,
    ]);

    const db = await connectDb();

    const { data, error } = await db
      .from("resources")
      .select("id,title,description,path")
      .or(conditions.join(","))
      .limit(50);

    if (error) throw new Error(error.message);

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { errro: { message: "Server Error" } },
      { status: 5000 },
    );
  }
}
