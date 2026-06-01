function parseHtml(html: string): string {
  let parsedHtml = "";

  parsedHtml = html
    .replaceAll("[cite_start]", "")
    .replaceAll("[cite_end]", "")
    .replaceAll(/\s*\[cite: \d+\]/g, "")
    .replaceAll(/\s*\[cite: \d+(, \d+)*\]/g, "");

  return parsedHtml;
}

export { parseHtml };
