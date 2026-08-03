import { NextRequest, NextResponse } from "next/server";
import puppeteer, { Browser } from "puppeteer";
import { authGate } from "@/lib/auth/authGate";
import connectDb from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let browser: Browser | null = null;

  try {
    const { id: resourceId } = await params;

    if (!resourceId) {
      throw new Error("Resource ID is required");
    }

    const { ok, res, payload } = await authGate(req, "jwt");
    if (!ok || !payload) return res;

    browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    const db = await connectDb();
    const { data, error } = await db
      .from("resources")
      .select()
      .eq("id", resourceId)
      .maybeSingle();

    if (error) throw error;
    if (!data?.content) {
      throw new Error("No resource found");
    }

    await page.setContent(data.content, {
      waitUntil: "load",
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="document.pdf"',
      },
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}