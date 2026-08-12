import { authGate } from "@/lib/auth/authGate";
import { uploadAvatar } from "@/db/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { ok, res, payload } = await authGate(req);
    if (!ok || !payload) return res;

    const formData = await req.formData();

    const image = formData.get("image");
    const filePath = formData.get("file-path");

    if (!(image instanceof File) || typeof filePath !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Image and file path are required" },
        },
        { status: 400 },
      );
    }

    if (!image || !filePath) {
      return NextResponse.json(
        { success: false, error: { message: "Image required" } },
        { status: 400 },
      );
    }

    await uploadAvatar(filePath, image);

    const imageUrl = `https://ampwczxrfpbqlkuawrdf.supabase.co/storage/v1/object/public/avatars/${filePath}?time=${Date.now()}`;
    return NextResponse.json({ data: { imageUrl } });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Server Internal Error" } },
      { status: 500 },
    );
  }
}
