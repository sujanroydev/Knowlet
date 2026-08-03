import { NextRequest, NextResponse } from "next/server";
import { pdf } from "@react-pdf/renderer";
import React from "react";

import { authGate } from "@/lib/auth/authGate";
import connectDb from "@/lib/db";
import ResourcePDF from "@/components/pdf/ResourcePDF";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: resourceId } = await params;

    if (!resourceId) {
      throw new Error("Resource ID is required");
    }

    const { ok, res, payload } = await authGate(req, "jwt");

    if (!ok || !payload) {
      return res;
    }

    const db = await connectDb();

    const { data, error } = await db
      .from("resources")
      .select("title, content")
      .eq("id", resourceId)
      .maybeSingle();

    if (error) throw error;

    if (!data?.content) {
      throw new Error("No resource found");
    }

    const pdfBuffer = await pdf(
      React.createElement(ResourcePDF, {
        title: data.title,
        content: data.content,
      })
    ).toBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${data.title || "document"}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate PDF",
      },
      {
        status: 500,
      }
    );
  }
}