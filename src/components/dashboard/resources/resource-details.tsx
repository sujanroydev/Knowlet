import SelectInput from "@/components/ui/select-input";
import TextInput from "@/components/ui/text-input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useResourceEditor } from "@/context/ResourceEditorContext";
import { getLevels } from "@/actions/resource/level";
import { getSubjects } from "@/actions/resource/subject";
import { getPapers } from "@/actions/resource/paper";

import type { Level, Paper, Subject } from "@/types/resource";

const defaultTypes = ["Select", "Notes", "PYQs", "Questions", "PDF"];
const defaultTargets = (type: string) => [
  "Select",
  ...(type === "PYQs"
    ? [...Array(6)].map((_, i) => `Solved ${i + 2021}`)
    : [...Array(15)].map((_, i) => `Unit ${i + 1}`)),
];

export default function ResourceDetails() {
  const { action, details, setDetails } = useResourceEditor();

  const [title, setTitle] = useState(details?.title ?? "");
  const [description, setDescription] = useState(details?.description ?? "");

  const [level, setLevel] = useState(details?.level ?? "");
  const [subject, setSubject] = useState(details?.subject ?? "");
  const [paper, setPaper] = useState(details?.paper ?? "");
  const [type, setType] = useState(details?.type ?? "");
  const [target, setTarget] = useState(details?.target ?? "");

  const [levels, setLevels] = useState<Level[]>();
  const [subjects, setSubjects] = useState<Subject[]>();
  const [papers, setPapers] = useState<Paper[]>();
  const [types, setTypes] = useState(defaultTypes);
  const [targets, setTargets] = useState(["Select"]);

  useEffect(() => {
    setTitle(details?.title ?? "");
    setDescription(details?.description ?? "");
  }, [details.title, details.description]);

  useEffect(() => {
    setDetails({ title, description, level, subject, paper, target, type });
  }, [title, description, level, subject, paper, target, type]);

  useEffect(() => {
    getLevels()
      .then(setLevels)
      .catch(() => toast.error("Failed to load levels"));
  }, []);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-foreground">
        Resource Details
      </h2>

      <div className="mt-6 space-y-8">
        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">
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
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Categorization
          </h3>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <SelectInput
              label="Resource Type"
              options={types}
              value={type}
              onChange={(e) => {
                const type = e.target.value;
                setType(type);

                setTargets(defaultTargets(type));
              }}
              disabled={action === "update" ? true : false}
            />

            <SelectInput
              label="Level"
              options={[
                "Select",
                ...(levels?.map((level) => level.title) || []),
              ]}
              value={level}
              onChange={(e) => {
                const level = e.target.value;
                setLevel(level);

                const id = levels?.find((l) => l.title === level)?.id;
                id &&
                  getSubjects(id)
                    .then(setSubjects)
                    .catch(() => toast.error("failed to load Subjects"));
              }}
              disabled={action === "update" ? true : false}
            />

            <SelectInput
              label="Subject"
              options={[
                "Select",
                ...(subjects?.map((subject) => subject.title) || []),
              ]}
              value={subject}
              onChange={(e) => {
                const subject = e.target.value;
                setSubject(subject);

                const id = subjects?.find((s) => s.title === subject)?.id;
                id &&
                  getPapers(id)
                    .then(setPapers)
                    .catch(() => toast.error("failed to load Papers"));
              }}
              disabled={action === "update" ? true : false}
            />

            {level.startsWith("Semester") && (
              <SelectInput
                label="Paper"
                options={[
                  "Select",
                  ...(papers?.map((subject) => subject.title) || []),
                ]}
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

                  const id = subjects?.find((s) => s.title === subject)?.id;
                  id &&
                    getPapers(id)
                      .then(setPapers)
                      .catch(() => toast.error("failed to load Papers"));
                }}
                disabled={action === "update" ? true : false}
              />
            )}

            <SelectInput
              label="target"
              options={targets}
              value={target}
              onChange={(e) => {
                const target = e.target.value;
                setTarget(target);
              }}
              disabled={action === "update" ? true : false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
