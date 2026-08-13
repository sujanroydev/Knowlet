import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const runtime = "nodejs";

export async function GET() {
  let browser;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
            }

            h1 {
              color: #222;
            }

            .box {
              padding: 20px;
              border: 2px solid #333;
              border-radius: 10px;
            }
          </style>
        </head>

        <body>
          <h1>Knowlet PDF Test</h1>

          <div class="box">
            Puppeteer is working on Vercel!
          </div>
        </body>
      </html>
    `);

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    return new Response(pdf.buffer as ArrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=test.pdf",
      },
    });
  } catch (error) {
    console.error("PDF TEST ERROR:", error);

    return Response.json(
      {
        error: "PDF generation failed",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
