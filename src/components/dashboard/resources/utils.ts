import { slugify } from "@/utils/slugify";

const titleCase = (text: string) =>
  text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const upperCase = (text: string) => text.replace("-", " ").toUpperCase();

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

  if (level.startsWith("semester")) {
    if (typeof paperSlug === "string") path += `/${paperSlug}`;
    else throw new Error("Invalid value of Paper.");
  }

  path += `/${typeSlug}/${targetSlug}`;

  return path;
}

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

function parseLibraryPath(path: string) {
  const parts = path.split("/");

  const levelSlug = parts[0];
  const subjectSlug = parts[1];

  const i = parts[0]?.startsWith("semester") ? 1 : 0;
  const paperSlug = i ? parts[2] : undefined;

  const typeSlug = parts[2 + i];
  const targetSlug = parts[3 + i];

  return {
    ...(levelSlug && {
      level: titleCase(levelSlug),
      levelSlug,
    }),
    ...(subjectSlug && {
      subject: titleCase(subjectSlug),
      subjectSlug,
    }),
    ...(paperSlug && {
      paper: upperCase(paperSlug),
      paperSlug,
    }),
    ...(typeSlug && {
      type: typeSlug === "pyqs" ? "PYQs" : typeSlug === "pdf" ? "PDF" : titleCase(typeSlug),
      typeSlug,
    }),
    ...(targetSlug && {
      target: titleCase(targetSlug),
      targetSlug,
    }),
  };
}

export { buildResourcePath, parseResourcePath, parseLibraryPath };
