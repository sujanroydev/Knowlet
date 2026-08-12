import SelectInput from "@/components/ui/select-input";
import TextInput from "@/components/ui/text-input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useResourceEditor } from "@/context/ResourceEditorContext";

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
    "Select",
    ...[...Array(4)].map((_, i) => `Class ${i + 9}`),
    ...[...Array(8)].map((_, i) => `Semester ${i + 1}`),
  ],
  subjects: [
    "Select",
    "Anthropology",
    "Accountancy",
    "Zoology",
    "Biology",
    "Statistics",
    "Political Science",
    "Physics",
    "Philosophy",
    "Psychology",
    "Sociology",
    "Mathematics",
    "History",
    "Geology",
    "Education",
    "Economics",
    "Commerce",
    "Ecology And Environmental Science",
    "Computer Science",
    "Computer Application",
    "Chemistry",
    "Botany",
    "Biotechnology",
  ],
  type: [
    "Select",
    "Notes",
    "PYQs",
    "Questions",
    "PDF",
  ],
  target: (type: string) => [
    "Select",
    ...(type === "pyq"
      ? [...Array(5)].map((_, i) => `Solved ${i + 2021}`)
      : [...Array(15)].map((_, i) => `Unit ${i + 1}`)),
  ],
};

export default function ResourceDetails() {
  const { action, details, setDetails } = useResourceEditor();

  const [title, setTitle] = useState(details?.title ?? "");
  const [description, setDescription] = useState(details?.description ?? "");

  const [level, setLevel] = useState(details?.level ?? "");
  const [subject, setSubject] = useState(details?.subject ?? "");
  const [paper, setPaper] = useState(details?.paper ?? "");
  const [type, setType] = useState(details?.type ?? "");
  const [target, setTarget] = useState(details?.target ?? "");

  useEffect(() => {
    setTitle(details?.title ?? "");
    setDescription(details?.description ?? "");
  }, [details.title, details.description])

  useEffect(() => {
    setDetails({ title, description, level, subject, paper, target, type });
  }, [title, description, level, subject, paper, target, type]);

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

            {level.startsWith("Semester") && (
              <TextInput
                label="Paper"
                placeholder="eg. DSC 152"
                value={paper}
                onChange={(e) => {
                  const value = e.target.value;
                  const match = value.match(
                    /^[^a-zA-Z]*([a-zA-Z]+)([^a-zA-Z\d]*)(\d+)[^\d]*$/,
                  );
                  if (!match) {
                    setPaper(value);
                    toast.warning("paper must be like DSC-152 or DSC 152");
                    return;
                  }
                  const paper = `${match[1].toUpperCase()} ${match[3]}`;
                  setPaper(paper);
                }}
                disabled={action === "update" ? true : false}
              />
            )}

            <SelectInput
              label="Resource Type"
              options={options.type}
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={action === "update" ? true : false}
            />

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
