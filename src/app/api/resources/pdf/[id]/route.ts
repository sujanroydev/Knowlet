import { NextRequest, NextResponse } from "next/server";
import { pdf } from "@react-pdf/renderer";
import React from "react";
import { Readable } from "stream";

import { authGate } from "@/lib/auth/authGate";
import { getResourceById } from "@/db/resource";
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

    if (!ok || !payload) return res;

    const resource = await getResourceById(resourceId);

    if (!resource?.content) throw new Error("No resource found");

    const stream = await pdf(
      React.createElement(ResourcePDF, {
        title: resource.title,
        content: resource.content,
      })
    ).toBuffer();

    const chunks: Buffer[] = [];

    for await (const chunk of stream as unknown as Readable) {
      chunks.push(Buffer.from(chunk));
    }

    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${resource.title || "document"}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);

    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}