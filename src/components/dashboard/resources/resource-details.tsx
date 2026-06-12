import SelectInput from "@/components/ui/select-input";
import TextInput from "@/components/ui/text-input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { buildResourcePath, parseResourcePath } from "./utils";

interface Details {
  title: string;
  description: string;
  target: string;
  type: string;
  slug: string;
  path: string;
}

const options = {
  level: [
    "select",
    ...[...Array(4)].map((_, i) => `class-${i + 8}`),
    ...[...Array(8)].map((_, i) => `semester-${i + 1}`),
  ],
  subjects: [
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
  ],
  target: (type: string) => [
    "select",
    ...(type === "pyq"
      ? [...Array(5)].map((_, i) => `solved-${i + 2021}`)
      : [...Array(15)].map((_, i) => `unit-${i + 1}`)),
  ],
};

export default function ResourceDetails({
  action,
  details,
  setDetails,
}: {
  action: "create" | "update";
  details?: Details;
  setDetails: (details: Details) => void;
}) {
  const [title, setTitle] = useState("Title");
  const [description, setDescription] = useState("Description");

  const [level, setLevel] = useState("select");
  const [subject, setSubject] = useState("select");
  const [paper, setPaper] = useState("");
  const [type, setType] = useState("select");
  const [target, setTarget] = useState("select");

  useEffect(() => {
    const path = buildResourcePath({ level, subject, paper, target, type });

    setDetails({ title, description, path, type, target, slug: target });
  }, [title, description, level, subject, paper, type, target]);

  useEffect(() => {
    if (details && Object.keys(details).length) {
      setTitle(details.title);
      setDescription(details.description);

      const { levelSlug, subjectSlug, paperSlug, targetSlug, typeSlug } =
        parseResourcePath(details.path);

      setLevel(levelSlug);
      setSubject(subjectSlug);
      paperSlug && setPaper(paperSlug);
      setTarget(targetSlug);
      setType(typeSlug);
    }
  }, [details]);

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
              options={["select", "note", "pyq", "important_question"]}
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={action === "update" ? true : false}
            />

            <SelectInput
              label="Level"
              options={options.level}
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              disabled={action === "update" ? true : false}
            />

            <SelectInput
              label="Subject"
              options={options.subjects}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={action === "update" ? true : false}
            />

            {level.startsWith("semester") && (
              <TextInput
                label="Paper"
                placeholder="Enter Paper Code eg. dsc-152"
                value={paper}
                onChange={(e) => {
                  const value = e.target.value;
                  const match = value.match(
                    /^[^a-zA-Z]*([a-zA-Z]+)([^a-zA-Z\d]*)(\d+)[^\d]*$/,
                  );
                  if (!match) {
                    setPaper(value);
                    toast.warning("paper must be like dsc-152");
                    return;
                  }
                  const paper = `${match[1]}-${match[3]}`.toLowerCase();
                  setPaper(paper);
                }}
                disabled={action === "update" ? true : false}
              />
            )}

            <SelectInput
              label="target"
              options={options.target(type)}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={action === "update" ? true : false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
