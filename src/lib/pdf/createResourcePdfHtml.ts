import { getResourceStyles } from "@/config/resourceThemes";
import { getPdfCss } from "@/lib/pdf/getPdfCss";
import { Resource } from "@/types/resource";

export function createResourcePdfHtml(resource: Resource) {
  const styles = getResourceStyles({ uuid: resource.id! });

  const css = getPdfCss();

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
        <article
          class="resource-content"
          style="${styles}"
        >
          ${resource.content || ""}
        </article>
      </body>
    </html>
  `;
}
