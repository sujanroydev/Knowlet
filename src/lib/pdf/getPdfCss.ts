import fs from "node:fs";
import path from "node:path";

export function getPdfCss() {
  const resourceCss = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/styles/resource-content.css",
    ),
    "utf8",
  );

  const pdfCss = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/styles/resource-pdf.css",
    ),
    "utf8",
  );

  return `${resourceCss}\n${pdfCss}`;
}