import SelectInput from "@/components/ui/select-input";
import TextInput from "@/components/ui/text-input";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Details {
  title: string;
  description: string;
  target: string;
  type: string;
  slug: string;
  path: string;
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
    if (!d.path) return;
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
              options={["select", "note", "pyq", "important_question"]}
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
