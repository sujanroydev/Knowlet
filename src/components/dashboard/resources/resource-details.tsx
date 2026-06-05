import SelectInput from "@/components/ui/select-input";
import TextInput from "@/components/ui/text-input";
import { useEffect, useState } from "react";

interface Details {
  title: string;
  description: string;
  target: string;
  type: string;
  slug: string;
  path: string;
}

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

export default function ResourceDetails({
  modificationAllowed = true,
  details: d,
  setDetails,
}: {
  modificationAllowed?: boolean;
  details: Details;
  setDetails: (details: Details) => void;
}) {
  const [title, setTitle] = useState(d.title || "Title");
  const [description, setDescription] = useState(
    d.description || "Description",
  );
  const [level, setLevel] = useState("select");
  const [subject, setSubject] = useState("select");
  const [paper, setPaper] = useState("");
  const [type, setType] = useState(d.type || "select");
  const [target, setTarget] = useState(d.target || "select");

  useEffect(() => {
    const path = buildResourcePath({ level, subject, paper, target, type });

    setDetails({ title, description, path, type, target, slug: target });
  }, [title, description, level, subject, paper, type, target]);

  useEffect(() => {
    const { level, subject, paper, target, type } = parseResourcePath(d.path);

    setLevel(level);
    setSubject(subject);
    paper && setPaper(paper);
    setTarget(target);
    setType(type);
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Resource Details</h2>

      <div className="mt-6 space-y-8">
        <div>
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Basic Information
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              label="Resource Title"
              placeholder="Enter title"
            />
            <TextInput
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              label="Description"
              placeholder="Resource Description"
            />
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Categorization
          </h3>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <SelectInput
              label="Resource Type"
              options={["select", "note", "pyq", "important-question"]}
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={!modificationAllowed}
            />

            <SelectInput
              label="Level"
              options={[
                "select",
                ...[...Array(4)].map((_, i) => `class-${i + 8}`),
                ...[...Array(8)].map((_, i) => `semester-${i + 1}`),
              ]}
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              disabled={!modificationAllowed}
            />

            <SelectInput
              label="Subject"
              options={[
                "select",
                "zoology",
                "statistics",
                "political-science",
                "physics",
                "philosophy",
                "mathematics",
                "history",
                "geology",
                "education",
                "economics",
                "commerce",
                "ecology-and-environmental-science",
                "computer-science",
                "computer-application",
                "chemistry",
                "botany",
                "biotechnology",
              ]}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={!modificationAllowed}
            />

            {level.startsWith("semester") && (
              <TextInput
                label="Paper"
                placeholder="Enter Paper Code eg. dsc-152"
                value={paper}
                onChange={(e) =>
                  setPaper(e.target.value.toLowerCase().split(" ").join("-"))
                }
                disabled={!modificationAllowed}
              />
            )}

            <SelectInput
              label="target"
              options={[
                "select",
                ...(type === "pyq"
                  ? [...Array(5)].map((_, i) => `solved-${i + 2021}`)
                  : [...Array(15)].map((_, i) => `unit-${i + 1}`)),
              ]}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={!modificationAllowed}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
