import { authGate } from "@/lib/auth/authGate";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { ok, res, payload } = await authGate(req);
    if (!ok || !payload) return res;

    const formData = await req.formData();
    const image = formData.get("image");
    const filePath = formData.get("file-path") as string;

    if (!image || !filePath) {
      return NextResponse.json(
        { success: false, error: { message: "Image required" } },
        { status: 400 },
      );
    }

    const db = await connectDb();

    const { error } = await db.storage.from("avatars").upload(filePath, image, {
      cacheControl: "3600",
      upsert: true,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: { message: error.message } },
        { status: 500 },
      );
    }

    const imageUrl = `https://ampwczxrfpbqlkuawrdf.supabase.co/storage/v1/object/public/avatars/${filePath}`;
    return NextResponse.json({ data: { imageUrl } });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Server Internal Error" } },
      { status: 500 },
    );
  }
}
