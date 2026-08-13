type Theme = {
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  h6: string;
  accent: string;
  link: string;
  linkHover: string;
  blockquote: string;
  code: string;
  hr: string;
};

type Resource = {
  title: string;
  description?: string | null;
  content?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function createResourcePdfHtml(
  resource: Resource,
  theme: Theme,
  css: string,
) {
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
          <header class="resource-pdf-header">
            <h1>${escapeHtml(resource.title)}</h1>

            ${
              resource.description
                ? `<p>${escapeHtml(resource.description)}</p>`
                : ""
            }
          </header>

          <main>
            ${resource.content || ""}
          </main>
        </article>
      </body>
    </html>
  `;
}