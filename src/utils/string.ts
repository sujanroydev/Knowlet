export function titleCase(text: string) {
  return text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function upperCase(text: string) {
  return text.replace("-", " ").toUpperCase();
}

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function streamToText(
  stream: AsyncIterable<{ text?: string }>,
): Promise<string> {
  let text = "";

  for await (const chunk of stream) {
    text += chunk.text ?? "";
  }

  return text;
}
