import { slugify, upperCase, titleCase } from "@/utils/string";

function parseResourcePath(path: string) {
  const parts = path.split("/");

  if (parts.length < 4) throw new Error("Invalid Resource Path");

  const levelSlug = parts[0];
  const subjectSlug = parts[1];

  if (levelSlug.startsWith("semester")) {
    if (parts.length < 5) throw new Error("Invalid Resource Path");
    else {
      const paperSlug = parts[2];
      const typeSlug = parts[3];
      const targetSlug = parts[4];

      if (
        !levelSlug ||
        !subjectSlug ||
        !paperSlug ||
        !typeSlug ||
        !targetSlug
      ) {
        throw new Error("Invalid Resource Path");
      }

      return {
        level: titleCase(levelSlug),
        subject: titleCase(subjectSlug),
        paper: upperCase(paperSlug),
        type: typeSlug === "pyqs" ? "PYQs" : typeSlug === "pdf" ? "PDF" : titleCase(typeSlug),
        target: titleCase(targetSlug),

        levelSlug,
        subjectSlug,
        paperSlug,
        typeSlug,
        targetSlug,
      };
    }
  } else {
    const typeSlug = parts[2];
    const targetSlug = parts[3];

    if (!levelSlug || !subjectSlug || !typeSlug || !targetSlug) {
      throw new Error("Invalid Resource Path");
    }

    return {
      level: titleCase(levelSlug),
      subject: titleCase(subjectSlug),
      type: typeSlug === "pyqs" ? "PYQs" : typeSlug === "pdf" ? "PDF" : titleCase(typeSlug),
      target: titleCase(targetSlug),

      levelSlug,
      subjectSlug,
      typeSlug,
      targetSlug,
    };
  }
}

function buildResourcePath({
  level,
  subject,
  paper,
  target,
  type,
}: {
  level: string;
  subject: string;
  paper?: string;
  target: string;
  type: string;
}) {
  if (!level || !subject || !type || !target) {
    throw new Error("level, subject, type and target are mandetory");
  }

  const levelSlug = slugify(level);
  const subjectSlug = slugify(subject);
  const paperSlug = paper ? slugify(paper) : undefined;
  const typeSlug = slugify(type);
  const targetSlug = slugify(target);

  let path = `${levelSlug}/${subjectSlug}`;

  if (level.startsWith("Semester")) {
    if (typeof paperSlug === "string") path += `/${paperSlug}`;
    else throw new Error("Invalid value of Paper.");
  }

  path += `/${typeSlug}/${targetSlug}`;

  return path;
}

export function generateResourceTitle(path: string) {
  const { level, subject, paper, type, target } = parseResourcePath(path);

  return `${target} | ${type} | ${paper ? `${paper} | ${subject}` : `${subject}`} | ${level} | Knowlet`;
}