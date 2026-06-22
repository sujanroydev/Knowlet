import { ResourceType } from "@/types/resource";

const typeToPath: Record<ResourceType, string> = {
  note: "notes",
  pyq: "pyq",
  important_question: "important-questions",
  pdf: "pdf",
};

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

function parsePath(path: string) {
  const parts = path.split("/");

  const levelSlug = parts[0];
  const subjectSlug = parts[1];

  const i = parts[0]?.startsWith("semester") ? 1 : 0;
  const paperSlug = i ? parts[2] : undefined;

  const typeSlug = Object.entries(typeToPath).find(
    (item) => item[1] === parts[2 + 1],
  )?.[0] as ResourceType;
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
      type: typeSlug === "pyq" ? upperCase(typeSlug) : titleCase(typeSlug),
      typeSlug,
    }),
    ...(targetSlug && {
      target: titleCase(targetSlug),
      targetSlug,
    }),
  };
}

export { buildResourcePath, parseResourcePath, parsePath };
