import { NextRequest } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

import { createDownload } from "@/db/resource/download";
import { authGate } from "@/lib/auth/authGate";
import { getResourceById } from "@/db/resource";
import { createResourcePdfHtml } from "@/lib/pdf/createResourcePdfHtml";
import { generateResourceTitle } from "@/utils/resource";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  let browser;

  try {
    const { ok, res, payload } = await authGate(req, "jwt");
    if (!ok || !payload) return res;

    const { id } = await params;

    const resource = await getResourceById(id);
    if (!resource) throw new Error("Resource not found");

    const isLocal = process.env.NODE_ENV === "development";

    browser = await puppeteer.launch({
      args: isLocal ? [] : chromium.args,
      executablePath: isLocal
        ? process.env.CHROME_EXECUTABLE_PATH
        : await chromium.executablePath(),
      headless: true,
    });

    const html = createResourcePdfHtml(resource);
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "load",
    });

    const downloadDate = new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date());

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,

      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm",
      },

      headerTemplate: `
        <div style="
          width: 100%;
          text-align: center;
          font-size: 10px;
          color: #64748b;
          font-family: Arial, Helvetica, sans-serif;
          font-style: italic;
        ">
          Knowledge grows when you keep learning.
        </div>
      `,

      footerTemplate: `
        <div style="
          width: 100%;
          padding: 0 15mm;
          box-sizing: border-box;
          font-size: 9px;
          line-height: 1;
          color: #94a3b8;
          font-family: Arial, Helvetica, sans-serif;
          display: flex;
          align-items: center;
          justify-content: space-between;
        ">
          <!-- Left: Download date -->
          <span style="
            flex: 1;
            text-align: left;
            white-space: nowrap;
          ">
            Downloaded: ${downloadDate}
          </span>

          <!-- Center -->
          <span style="
            flex: 1;
            text-align: center;
            white-space: nowrap;
          ">
            Learn • Understand • Grow — Knowlet · knowlet.in
          </span>

          <!-- Right: Page number -->
          <span style="
            flex: 1;
            text-align: right;
            white-space: nowrap;
          ">
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
          </span>
        </div>
      `,
    });

    void createDownload(id, payload.user_id).catch((error) => {
      console.error("Faild to Record download", error);
    });

    return new Response(new Uint8Array(pdf).buffer as ArrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${generateResourceTitle(resource.path)}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);

    return Response.json(
      {
        error: "PDF generation failed",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  } finally {
    await browser?.close();
  }
}
