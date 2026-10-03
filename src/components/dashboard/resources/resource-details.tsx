import SelectInput from "@/components/ui/select-input";
import TextInput from "@/components/ui/text-input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useResourceEditor } from "@/context/ResourceEditorContext";
import { getLevels } from "@/actions/resource/level";
import { getSubjects } from "@/actions/resource/subject";
import { getPapers } from "@/actions/resource/paper";

import type { Level, Paper, Subject } from "@/types/resource";
import { buildResourcePath } from "@/utils/resource";
import { getNearByResources } from "@/actions/resource";
import { slugify, titleCase } from "@/utils/string";

// const defaultTypes = ["Select", "Notes", "PYQs", "Questions", "PDF"];
const defaultTypes = ["Select", "Notes", "Questions"];

const defaultTargets = (type: string) =>
  type === "PYQs"
    ? Array(6)
        .fill(undefined)
        .map((_, i) => `Solved ${i + 2021}`)
    : Array(15)
        .fill(undefined)
        .map((_, i) => `Unit ${i + 1}`);

export default function ResourceDetails({
  disableTarget = false,
}: {
  disableTarget?: boolean;
}) {
  const { action, setAction, details, setDetails } = useResourceEditor();

  const [title, setTitle] = useState(details?.title ?? "");
  const [description, setDescription] = useState(details?.description ?? "");

  const [level, setLevel] = useState(details?.level ?? "");
  const [subject, setSubject] = useState(details?.subject ?? "");
  const [paper, setPaper] = useState(details?.paper ?? "");
  const [type, setType] = useState(details?.type ?? "");
  const [target, setTarget] = useState(details?.target ?? "");

  const [levels, setLevels] =
    useState<(Partial<Level> & { title: string })[]>();
  const [subjects, setSubjects] =
    useState<(Partial<Subject> & { title: string })[]>();
  const [papers, setPapers] =
    useState<(Partial<Paper> & { title: string })[]>();

  const [targets, setTargets] = useState<{ title: string; exist: boolean }[]>();

  useEffect(() => {
    setTitle(details?.title ?? "");
    setDescription(details?.description ?? "");
  }, [details.title, details.description]);

  useEffect(() => {
    setDetails({ title, description, level, subject, paper, target, type });
  }, [title, description, level, subject, paper, target, type]);

  useEffect(() => {
    const items = [level, subject, paper, type];
    if (items.some((i) => !i)) return;

    const path = buildResourcePath({
      level,
      subject,
      paper,
      type,
      target: type.startsWith("Notes") ? "Unit " : "Solved ",
    });

    !disableTarget &&
      getNearByResources(path).then((items) => {
        const targets = defaultTargets(type).map((t) => ({
          title: t,
          exist: items.some((item) => item.target === slugify(t)),
        }));

        setTargets(targets);
      });
  }, [type, level, subject, paper]);

  useEffect(() => {
    if (!subjects?.some((s) => s.title === subject)) setSubject("");
    if (!papers?.some((p) => p.title === paper)) setPaper("");
  }, [levels, subjects, papers]);

  useEffect(() => {
    const muted = targets?.some((t) => {
      if (slugify(t.title) === slugify(target)) return t.exist;
      return false;
    });

    if (muted) {
      toast.warning(`${target} already exist`);
      // console.log("change to update");
      // setAction("update");
    } else {
      // setAction("create");
    }
  }, [target]);

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
        {!disableTarget && (
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
        )}

        <div>
          {!disableTarget && (
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Categorization
            </h3>
          )}

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <SelectInput
              label="Resource Type"
              options={defaultTypes}
              value={type}
              onChange={(e) => {
                const type = e.target.value;
                setType(type);
              }}
              disabled={action === "update" ? true : false}
            />

            <SelectInput
              label="Level"
              options={[
                "Select",
                ...(levels?.map((level) => level.title) || []),
              ]}
              addButton={true}
              value={level}
              onChange={(e) => {
                const level = e.target.value;
                setLevel(level);

                const id = levels?.find((l) => l.title === level)?.id;
                id &&
                  getSubjects(id)
                    .then((subjects) => {
                      setSubjects(subjects);
                      return subjects;
                    })
                    .then((subjects) => {
                      const paperId = subjects?.find(
                        (s) => s.title === subject,
                      )?.id;
                      paperId &&
                        getPapers(paperId)
                          .then(setPapers)
                          .catch(() => toast.error("failed to load Papers"));
                    })
                    .catch(() => toast.error("failed to load Subjects"));
              }}
              onInputEnd={(value) => {
                const level = titleCase(value);
                if (!level) return;

                setLevels((levels) => [...(levels || []), { title: level }]);
                setLevel(level);
              }}
              disabled={action === "update" ? true : false}
            />

            <SelectInput
              label="Subject"
              options={[
                "Select",
                ...(subjects?.map((subject) => subject.title) || []),
              ]}
              addButton={true}
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
              onInputEnd={(value) => {
                const subject = titleCase(value);
                if (!subject) return;

                setSubjects((subjects) => [
                  ...(subjects || []),
                  { title: subject },
                ]);
                setSubject(subject);
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
                addButton={true}
                value={paper}
                onChange={(e) => {
                  const paper = e.target.value;
                  setPaper(paper);
                }}
                onInputEnd={(value) => {
                  const match = value.match(
                    /^[^a-zA-Z]*([a-zA-Z]+)([^a-zA-Z\d]*)(\d+)[^\d]*$/,
                  );

                  if (!match) {
                    setPaper(value);
                    toast.warning("paper must be like DSC-152 or DSC 152");
                    return;
                  }

                  const paper = `${match[1].toUpperCase()} ${match[3]}`;

                  setPapers((papers) => [...(papers || []), { title: paper }]);
                  setPaper(paper);
                }}
                disabled={action === "update" ? true : false}
              />
            )}

            {!disableTarget && (
              <SelectInput
                label="target"
                options={["Select", ...(targets?.map((t) => t.title) || [])]}
                mutedOptions={[false, ...(targets?.map((t) => t.exist) || [])]}
                value={target}
                onChange={(e) => {
                  const target = e.target.value;
                  setTarget(target);
                }}
                disabled={action === "update" ? true : false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
