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

    const html = createResourcePdfHtml(resource);

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "load",
    });

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
          position: relative;
          font-size: 9px;
          color: #94a3b8;
          font-family: Arial, Helvetica, sans-serif;
          text-align: center;
        ">
          Learn • Understand • Grow —
          <a
            href="https://knowlet.in"
            style="
              color: #64748b;
              text-decoration: none;
            "
          >
            Knowlet
          </a>

          <span style="
            position: absolute;
            right: 15mm;
          ">
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
          </span>
        </div>
      `,
    });

    void createDownload(id, payload.user_id).catch((error) => {
      console.error("Faild to Record download", error);
    });

    return new Response(
      new Uint8Array(pdf).buffer as ArrayBuffer,
      {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${generateResourceTitle(resource.path)}.pdf"`,
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