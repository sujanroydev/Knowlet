import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

import { supabase } from "@/lib/supabase";
import { createResourcePdfHtml } from "@/lib/pdf/createResourcePdfHtml";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  let browser;

  try {
    const { id } = await params;

    const { data: resource, error } = await supabase
      .from("resources")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !resource) {
      return Response.json(
        { error: "Resource not found" },
        { status: 404 },
      );
    }

    const html = createResourcePdfHtml(resource);

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "load", // remove
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    return new Response(
      new Uint8Array(pdf).buffer as ArrayBuffer,
      {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${resource.title}.pdf"`,
        },
      },
    );
  } catch (error) {
    console.error("PDF generation failed:", error);

    return Response.json(
      {
        error: "PDF generation failed",
        message:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 },
    );
  } finally {
    await browser?.close();
  }
}