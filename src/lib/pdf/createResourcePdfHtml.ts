import { getResourceStyles } from "@/config/resourceThemes";
import { getPdfCss } from "@/lib/pdf/getPdfCss";
import { Resource } from "@/types/resource";
import { processResourceHtml, renderToc } from "@/utils/resource";
import { titleCase } from "@/utils/string";

export function createResourcePdfHtml(resource: Resource) {
  const resourceStyles = getResourceStyles({ uuid: resource.id });

  const style = Object.entries(resourceStyles)
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ");

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
        <div class="resource-content" style="${style}">
          ${resource.title && `<h1>${titleCase(resource.target!)}: ${resource.title}</h1>`}
          ${
            toc &&
            `<nav
              class="toc"
              aria-label="Table of Contents"
            >${renderToc(toc, 1)}</nav>`
          }

          <article>${html}</article>
        </div>
      </body>
    </html>
  `;
}
