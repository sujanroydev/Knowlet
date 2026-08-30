import { NextRequest, NextResponse } from "next/server";
import {
  compressImageToTarget,
  validateImageFile,
} from "@/lib/image-compression";
import { uploadNotificationImage } from "@/db/notification";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        {
          error: { message: "Image file is required" },
        },
        { status: 400 },
      );
    }

    // Validate image before compression
    const validation = validateImageFile(image);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: { message: validation.error },
        },
        { status: 400 },
      );
    }

    // Compress image to target size (100 KB)
    const compressedImage = await compressImageToTarget(image, 100);

    // Generate unique file path
    const timestamp = Date.now();
    const randomId = crypto.randomUUID().split("-")[0];
    const fileExtension = image.type === "image/png" ? "png" : "jpg";
    const filePath = `notifications/${timestamp}-${randomId}.${fileExtension}`;

    // Upload to Supabase storage
    await uploadNotificationImage(filePath, compressedImage);

    // Get the base URL from environment or derive from Supabase config
    const supabaseUrl = process.env.SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error("SUPABASE_URL environment variable not configured");
    }

    // Construct public URL
    const imageUrl = `${supabaseUrl}/storage/v1/object/public/notification-images/${filePath}?time=${Date.now()}`;

    return NextResponse.json(
      {
        data: {
          imageUrl,
          fileName: `${timestamp}-${randomId}.${fileExtension}`,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error ? error.message : "Failed to upload image",
        },
      },
      { status: 500 },
    );
  }
}
