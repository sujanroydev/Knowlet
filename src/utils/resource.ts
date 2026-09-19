import { parse } from "node-html-parser";

import { slugify, upperCase, titleCase } from "@/utils/string";
import { TocItem } from "@/types/resource";

export function parseResourcePath(path: string) {
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
        type:
          typeSlug === "pyqs"
            ? "PYQs"
            : typeSlug === "pdf"
              ? "PDF"
              : titleCase(typeSlug),
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
      type:
        typeSlug === "pyqs"
          ? "PYQs"
          : typeSlug === "pdf"
            ? "PDF"
            : titleCase(typeSlug),
      target: titleCase(targetSlug),

      levelSlug,
      subjectSlug,
      typeSlug,
      targetSlug,
    };
  }
}

export function parseLibraryPath(path: string) {
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
      type:
        typeSlug === "pyqs"
          ? "PYQs"
          : typeSlug === "pdf"
            ? "PDF"
            : titleCase(typeSlug),
      typeSlug,
    }),
    ...(targetSlug && {
      target: titleCase(targetSlug),
      targetSlug,
    }),
  };
}

export function buildResourcePath({
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

  return `${target} - ${paper ? `${paper} - ${subject}` : subject} - ${level} - ${type}`;
}

export function processResourceHtml(html: string) {
  const root = parse(html);

  // Remove existing/default TOC
  root.querySelectorAll(".toc").forEach((toc) => {
    toc.remove();
  });

  // Remove title H1
  root.querySelectorAll("h1").forEach((h1) => {
    h1.remove();
  });

  const headings = root.querySelectorAll("h2, h3");

  const toc: TocItem[] = [];
  const stack: TocItem[] = [];
  const usedIds = new Set<string>();

  for (const heading of headings) {
    const level = Number(heading.rawTagName.slice(1));
    const text = heading.text.trim();

    if (!text) continue;

    let id =
      heading.getAttribute("id") ||
      text
        .toLowerCase()
        .replace(/(\d+)\.(\d+)/g, "$1-$2")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    const baseId = id;
    let counter = 2;

    while (usedIds.has(id)) {
      id = `${baseId}-${counter}`;
      counter++;
    }

    usedIds.add(id);
    heading.setAttribute("id", id);

    const item: TocItem = {
      id,
      text,
      level,
    };

    // Find the correct parent
    while (stack.length && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length) {
      const parent = stack[stack.length - 1];
      parent.children ??= [];
      parent.children.push(item);
    } else {
      toc.push(item);
    }

    stack.push(item);
  }

  return {
    html: root.toString(),
    toc,
  };
}

export function renderToc(items: TocItem[], level = 0): string {
  const indent = " ".repeat(level * 2);

  return `${indent}<ul>
${items
  .map((item) => {
    const children = item.children?.length
      ? `\n${renderToc(item.children, level + 1)}\n${indent}`
      : "";

    return `${indent}    <li>
${indent}        <a href="#${item.id}">${item.text}</a>${children}
${indent}    </li>`;
  })
  .join("\n")}
${indent}</ul>`;
}
