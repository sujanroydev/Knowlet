function parseResource(html: string): {
  title: string;
  description: string;
  content: string;
  word_count: string;
} {
  let title = "";
  let description = "";
  let content = "";
  let word_count = "";

  title = "Unknown Title";

  description =
    html
      .match(/\<h1[^>]*\>(.*?)\<\/h1\>/g)?.[0]
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim() || "";

  content = html
    .replaceAll(/\[cite_start\]\s*/g, "")
    .replaceAll(/\s*\[cite: \d+\]/g, "")
    .replaceAll(/\s*\[cite: \d+(, \d+)*\]/g, "");

  word_count = content.split(/\s+/).length.toString() || "0";

  return { title, description, content, word_count };
}

export { parseResource };
