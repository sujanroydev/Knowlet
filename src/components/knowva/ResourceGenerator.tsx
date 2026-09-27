"use client";

import { useMemo, useState } from "react";
import ResourceDetails from "../dashboard/resources/resource-details";
import { useResourceEditor } from "@/context/ResourceEditorContext";
import { toast } from "sonner";
import { buildResourcePath } from "@/utils/resource";
import { ensureResourceHierarchy, insertResource } from "@/actions/resource";
import { NewResource } from "@/types/resource";
import { ActionState } from "@/types/main";
import { generateResource } from "@/actions/knowva/resource";
import { slugify } from "@/utils/string";

type Status =
  | "pending"
  | "queue"
  | "generating"
  | "publishing"
  | "success"
  | "failed"
  | "skipped";

type Unit = {
  id: number;
  target: string;
  syllabus: string;
  status: Status;
  title?: string;
  description?: string;
  error?: string;
};

const initialUnits: Unit[] = Array(5)
  .fill(null)
  .map((_, i) => ({
    id: i + 1,
    target: `Unit ${i + 1}`,
    syllabus: "",
    status: "pending",
  }));

export default function ResourceGenerator() {
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [buttonState, setButtonState] = useState<
    ActionState | "ensureing_hierarchy"
  >("active");

  const { details, setDetails } = useResourceEditor();

  const completed = useMemo(
    () =>
      units.filter(
        (unit) => unit.status === "success" || unit.status === "skipped",
      ).length,
    [units],
  );

  const successCount = units.filter((unit) => unit.status === "success").length;

  const failedCount = units.filter((unit) => unit.status === "failed").length;

  const progress = Math.round((completed / units.length) * 100);

  function updateUnit(id: number, syllabus: string) {
    setUnits((current) =>
      current.map((unit) =>
        unit.id === id
          ? {
              ...unit,
              syllabus,
              status: "pending",
              error: undefined,
            }
          : unit,
      ),
    );
  }

  function addUnit() {
    setUnits((current) => [
      ...current,
      {
        id: current.length > 0 ? Math.max(...current.map((u) => u.id)) + 1 : 1,
        target: `Unit ${current.length + 1}`,
        syllabus: "",
        status: "pending",
      },
    ]);
  }

  function removeUnit(id: number) {
    if (buttonState !== "active") return;

    setUnits((current) => current.filter((unit) => unit.id !== id));
  }

  async function generate() {
    if (buttonState !== "active") return;

    const { level, subject, paper, type } = details;

    if (!level || !subject || !type) {
      toast.error("missing details");
      return;
    }

    if (level.startsWith("Semester") && !paper) {
      toast.error("Paper is missing");
      return;
    }

    setButtonState("ensureing_hierarchy");

    setUnits((current) =>
      current.map((unit) => ({
        ...unit,
        status: unit.syllabus.trim() ? "queue" : "skipped",
        error: undefined,
      })),
    );

    // ensure hyrarcy
    const { levelId, subjectId, paperId } = await ensureResourceHierarchy({
      type,
      level,
      subject,
      paper,
      target: type.startsWith("PYQs") ? "Solved" : "Unit",
    });

    setButtonState("loading");

    for (const [index, unit] of units.entries()) {
      if (!unit.syllabus.trim()) continue;

      // update status
      setUnits((units) =>
        units.map((unit, i) =>
          i === index ? { ...unit, status: "generating" } : unit,
        ),
      );

      // generate
      let generated;
      try {
        generated = await generateResource({
          syllabus: unit.syllabus,
          model: "gemini-3.5-flash-lite",
        });

        if (typeof generated !== "string") {
          throw new Error("Invalid generation response");
        }
      } catch {
        setUnits((units) =>
          units.map((unit, i) =>
            i === index ? { ...unit, status: "failed" } : unit,
          ),
        );
        continue;
      }

      const parsed = JSON.parse(generated);

      const path = buildResourcePath({
        level,
        subject,
        paper,
        target: unit.target,
        type,
      });

      const resource: NewResource = {
        level_id: levelId,
        subject_id: subjectId,
        paper_id: paperId,

        title: parsed.title,
        description: parsed.description,
        content: parsed.resource,

        type: slugify(type),
        target: slugify(unit.target),
        slug: slugify(unit.target),
        path,
      };

      setUnits((units) =>
        units.map((unit, i) =>
          i === index ? { ...unit, status: "publishing" } : unit,
        ),
      );

      let status: Status;

      // insert resource
      try {
        await insertResource(resource);
        console.log(resource);
        status = "success";
      } catch {
        status = "failed";
      }

      setUnits((units) =>
        units.map((unit, i) => (i === index ? { ...unit, status } : unit)),
      );
    }

    setButtonState("active");
  }

  function reset() {
    if (buttonState !== "active") return;

    setUnits(
      initialUnits.map((unit) => ({
        ...unit,
        status: "pending",
        title: undefined,
        description: undefined,
        error: undefined,
      })),
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Resource Generator
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Generate and publish Knowva learning resources from a syllabus.
          </p>
        </div>

        {/* Details */}
        <ResourceDetails disableTarget={true} />

        {/* Progress */}
        <section className="mt-6 rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold">Generation progress</h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {completed} / {units.length} completed
                {successCount > 0 && ` · ${successCount} published`}
                {failedCount > 0 && ` · ${failedCount} failed`}
              </p>
            </div>

            <span className="text-sm font-medium">{progress}%</span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {/* Units */}
        <section className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Units</h2>

              <p className="text-sm text-muted-foreground">
                Add or edit the syllabus for each unit.
              </p>
            </div>

            <button
              onClick={addUnit}
              disabled={buttonState !== "active"}
              className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              + Add unit
            </button>
          </div>

          <div className="space-y-4">
            {units.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                disabled={buttonState !== "active"}
                onChange={(value) => updateUnit(unit.id, value)}
                onRemove={() => removeUnit(unit.id)}
              />
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="sticky bottom-20 mt-8 flex items-center justify-between rounded-xl border bg-card/95 p-3 shadow-lg backdrop-blur">
          <button
            onClick={reset}
            disabled={buttonState !== "active"}
            className="rounded-lg px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
          >
            Reset
          </button>

          <button
            onClick={generate}
            disabled={buttonState !== "active"}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {buttonState === "loading"
              ? "Generating..."
              : buttonState === "ensureing_hierarchy"
                ? "Preparing..."
                : `Generate ${units.filter((u) => u.syllabus.trim()).length} resources`}
          </button>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </span>

      {children}
    </label>
  );
}

function UnitCard({
  unit,
  disabled,
  onChange,
  onRemove,
}: {
  unit: Unit;
  disabled: boolean;
  onChange: (value: string) => void;
  onRemove: () => void;
}) {
  return (
    <article className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-medium">{unit.target}</span>

          <StatusBadge status={unit.status} />
        </div>

        <button
          onClick={onRemove}
          disabled={disabled}
          className="text-xs text-muted-foreground hover:text-destructive disabled:opacity-50"
        >
          Remove
        </button>
      </div>

      <textarea
        value={unit.syllabus}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={3}
        placeholder={`Enter syllabus for ${unit.target}...`}
        className="w-full resize-y rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
      />

      {unit.title && (
        <div className="mt-4 rounded-lg bg-muted/50 p-3">
          <p className="text-xs font-medium text-muted-foreground">
            Generated resource
          </p>

          <p className="mt-1 text-sm font-medium">{unit.title}</p>

          {unit.description && (
            <p className="mt-1 text-xs text-muted-foreground">
              {unit.description}
            </p>
          )}
        </div>
      )}

      {unit.error && (
        <div className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {unit.error}
        </div>
      )}
    </article>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const config: Record<Status, { label: string; className: string }> = {
    pending: {
      label: "Pending",
      className: "bg-muted text-muted-foreground",
    },
    queue: {
      label: "In Queue",
      className: "bg-muted text-muted-foreground",
    },
    generating: {
      label: "Generating",
      className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    publishing: {
      label: "Publishing",
      className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    },
    success: {
      label: "Published",
      className: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    failed: {
      label: "Failed",
      className: "bg-destructive/10 text-destructive",
    },
    skipped: {
      label: "Skipped",
      className: "bg-muted text-muted-foreground",
    },
  };

  const item = config[status];

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${item.className}`}
    >
      {status === "generating" && (
        <span className="mr-1 inline-block animate-pulse">●</span>
      )}

      {item.label}
    </span>
  );
}
