import { ResourceType } from "@/types/resource";

const typeToPath: Record<ResourceType, string> = {
  note: "notes",
  pyq: "pyq",
  important_question: "important-questions",
  pdf: "pdf",
};

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
  if (!level || !subject || !type || !target)
    throw new Error("leve, subject, type and target are mandetory");

  let path = `${level}/${subject}`;

  if (level.startsWith("semester")) {
    if (typeof paper === "string") path += `/${paper}`;
    else throw new Error("Invalid value of Paper.");
  }

  path += `/${typeToPath[type as ResourceType]}/${target}`;

  return path;
}

function parseResourcePath(path: string) {
  const parts = path.split("/");

  if (parts.length < 4) throw new Error("Invalid Resource Path");

  const titleCase = (text: string) =>
    text
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const upperCase = (text: string) => text.replace("-", " ").toUpperCase();

  const levelSlug = parts[0];
  const subjectSlug = parts[1];

  if (levelSlug.startsWith("semester")) {
    if (parts.length < 5) throw new Error("Invalid Resource Path");
    else {
      const paperSlug = parts[2];
      const typeSlug = (Object.entries(typeToPath).find(
        (i) => i[1] === parts[3],
      ) || [])[0] as ResourceType;
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
        levelSlug,
        subject: titleCase(subjectSlug),
        subjectSlug,
        paper: upperCase(paperSlug),
        paperSlug,
        type: typeSlug === "pyq" ? upperCase(typeSlug) : titleCase(typeSlug),
        typeSlug,
        target: titleCase(targetSlug),
        targetSlug,
      };
    }
  } else {
    const typeSlug = (Object.entries(typeToPath).find(
      (i) => i[1] === parts[2],
    ) || [])[0] as ResourceType;
    const targetSlug = parts[3];

    if (!levelSlug || !subjectSlug || !typeSlug || !targetSlug) {
      throw new Error("Invalid Resource Path");
    }

    return {
      level: titleCase(levelSlug),
      levelSlug,
      subject: titleCase(subjectSlug),
      subjectSlug,
      type: titleCase(typeSlug),
      typeSlug,
      target: titleCase(targetSlug),
      targetSlug,
    };
  }
}

export { buildResourcePath, parseResourcePath };
