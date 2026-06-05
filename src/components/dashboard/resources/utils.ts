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

  const level = parts[0];
  const subject = parts[1];

  if (level.startsWith("semester")) {
    if (parts.length < 5) throw new Error("Invalid Resource Path");
    else {
      const paper = parts[2];
      const type = (Object.entries(typeToPath).find((i) => i[1] === parts[3]) ||
        [])[0] as ResourceType;
      const target = parts[4];

      if (!level || !subject || !paper || !type || !target) {
        throw new Error("Invalid Resource Path");
      }

      return { level, subject, paper, type, target };
    }
  } else {
    const type = (Object.entries(typeToPath).find((i) => i[1] === parts[2]) ||
      [])[0] as ResourceType;
    const target = parts[3];

    if (!level || !subject || !type || !target) {
      throw new Error("Invalid Resource Path");
    }

    return { level, subject, type, target };
  }
}
