import { resourceThemes } from "@/config/resourceThemes";
import { getPdfCss } from "@/lib/pdf/getPdfCss";
import { Resource } from "@/types/resource";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getThemeIndex(uuid: string) {
  let hash = 0;

  for (let i = 0; i < uuid.length; i++) {
    hash = (hash * 31 + uuid.charCodeAt(i)) >>> 0;
  }

  return hash % resourceThemes.length;
}

export function createResourcePdfHtml(resource: Resource) {
  const theme = resourceThemes[getThemeIndex(resource.id!)];

  const css = getPdfCss();

  const variables = `
    --h1: ${theme.h1};
    --h2: ${theme.h2};
    --h3: ${theme.h3};
    --h4: ${theme.h4};
    --h5: ${theme.h5};
    --h6: ${theme.h6};
    --accent: ${theme.accent};
    --link: ${theme.link};
    --link-hover: ${theme.linkHover};
    --blockquote: ${theme.blockquote};
    --code: ${theme.code};
    --hr: ${theme.hr};
  `;

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
          style="${variables}"
        >
          ${resource.content || ""}
        </article>
      </body>
    </html>
  `;
}