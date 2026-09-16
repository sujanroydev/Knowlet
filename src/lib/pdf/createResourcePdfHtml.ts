import { getResourceStyles } from "@/config/resourceThemes";
import { getPdfCss } from "@/lib/pdf/getPdfCss";
import { Resource } from "@/types/resource";
import { processResourceHtml, renderToc } from "@/utils/resource";

export function createResourcePdfHtml(resource: Resource) {
  const styles = getResourceStyles({ uuid: resource.id! });

  const css = getPdfCss();

  const { html, toc } = processResourceHtml(resource.content);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />

        <style>
          ${css}
        </style>
      </head>

      <body>
        <div class="resource-content" style="${styles}">
          ${resource.title && `<h1>${resource.title}</h1>`}
          ${
            toc &&
            `<nav
              class="toc"
              aria-label="Table of Contents"
            >${renderToc(toc, 1)}</nav>`
          }

          <article>${resource.content}</article>
        </div>
      </body>
    </html>
  `;
}
