import { apiError } from "@/lib/api-response";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { status } = await req.json();
    const { id } = await params;

    const db = await connectDb();

    const { data, error } = await db
      .from("resource_reports")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return apiError("Server Error", 500);
  }
}
