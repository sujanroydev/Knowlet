"use client";

import { useMemo, useState } from "react";

type Status =
  | "pending"
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

const initialUnits: Unit[] = [
  {
    id: 1,
    target: "Unit 1",
    syllabus: "",
    status: "pending",
  },
  {
    id: 2,
    target: "Unit 2",
    syllabus: "",
    status: "pending",
  },
  {
    id: 3,
    target: "Unit 3",
    syllabus: "",
    status: "pending",
  },
  {
    id: 4,
    target: "Unit 4",
    syllabus: "",
    status: "pending",
  },
  {
    id: 5,
    target: "Unit 5",
    syllabus:
      "Pointers and structures: main function, function prototyping, handling pointers, C structures and limitations",
    status: "pending",
  },
  {
    id: 6,
    target: "Unit 6",
    syllabus:
      "Classes and objects: specifying class, a sample C++ program with class, access specifiers, defining member functions, nesting of member functions",
    status: "pending",
  },
  {
    id: 7,
    target: "Unit 7",
    syllabus:
      "More on classes and objects: function definition inside the class and outside the class, private member functions, arrays within the class, memory allocation of objects",
    status: "pending",
  },
  {
    id: 8,
    target: "Unit 8",
    syllabus:
      "Handling functions: function calling mechanisms: call by Value, call by address & call by reference, objects as function arguments",
    status: "pending",
  },
  {
    id: 9,
    target: "Unit 9",
    syllabus:
      "More on functions: inline functions, making outside function inline, friend functions",
    status: "pending",
  },
  {
    id: 10,
    target: "Unit 10",
    syllabus:
      "Static members and polymorphism: Static Data Members & Static Functions, Function Overloading",
    status: "pending",
  },
  {
    id: 11,
    target: "Unit 11",
    syllabus:
      "Constructors and destructors: constructors, parameterized constructors, copy constructors and dynamic constructors, multiple constructors in a class",
    status: "pending",
  },
  {
    id: 12,
    target: "Unit 12",
    syllabus:
      "More on constructors and destructors: constructors with default arguments, dynamic initialization of objects, destructors",
    status: "pending",
  },
  {
    id: 13,
    target: "Unit 13",
    syllabus:
      "Inheritance: defining derived classes, single inheritance, making a private member inheritable, multilevel inheritance, hierarchical inheritance, multiple inheritances, hybrid inheritance",
    status: "pending",
  },
  {
    id: 14,
    target: "Unit 14",
    syllabus:
      "File handling: file handling operations: open, close, read and write",
    status: "pending",
  },
];

export default function ResourceGenerator() {
  const [level, setLevel] = useState("Semester 2");
  const [subject, setSubject] = useState("Computer Application");
  const [paper, setPaper] = useState("ECAP 202");
  const [type, setType] = useState("Notes");

  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [running, setRunning] = useState(false);

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
    if (running) return;

    setUnits((current) => current.filter((unit) => unit.id !== id));
  }

  async function generate() {
    if (running) return;

    setRunning(true);

    setUnits((current) =>
      current.map((unit) => ({
        ...unit,
        status: unit.syllabus.trim() ? "generating" : "skipped",
        error: undefined,
      })),
    );

    try {
      const response = await fetch("/api/resources/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          level,
          subject,
          paper,
          type,
          units: units.map(({ id, target, syllabus }) => ({
            id,
            target,
            syllabus,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setUnits((current) =>
        current.map((unit) => {
          const result = data.results?.find(
            (item: {
              id: number;
              status: Status;
              title?: string;
              description?: string;
              error?: string;
            }) => item.id === unit.id,
          );

          if (!result) return unit;

          return {
            ...unit,
            status: result.status,
            title: result.title,
            description: result.description,
            error: result.error,
          };
        }),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      setUnits((current) =>
        current.map((unit) =>
          unit.status === "generating"
            ? {
                ...unit,
                status: "failed",
                error: message,
              }
            : unit,
        ),
      );
    } finally {
      setRunning(false);
    }
  }

  function reset() {
    if (running) return;

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

        {/* Metadata */}
        <section className="rounded-xl border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold">Resource details</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Level">
              <input
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                disabled={running}
                className="input"
                placeholder="Semester 2"
              />
            </Field>

            <Field label="Subject">
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={running}
                className="input"
                placeholder="Computer Application"
              />
            </Field>

            <Field label="Paper">
              <input
                value={paper}
                onChange={(e) => setPaper(e.target.value)}
                disabled={running}
                className="input"
                placeholder="ECAP 202"
              />
            </Field>

            <Field label="Type">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                disabled={running}
                className="input"
              >
                <option>Notes</option>
                <option>PYQ</option>
                <option>Important Questions</option>
                <option>PDF</option>
              </select>
            </Field>
          </div>
        </section>

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
              disabled={running}
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
                disabled={running}
                onChange={(value) => updateUnit(unit.id, value)}
                onRemove={() => removeUnit(unit.id)}
              />
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="sticky bottom-4 mt-8 flex items-center justify-between rounded-xl border bg-card/95 p-3 shadow-lg backdrop-blur">
          <button
            onClick={reset}
            disabled={running}
            className="rounded-lg px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
          >
            Reset
          </button>

          <button
            onClick={generate}
            disabled={running}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {running
              ? "Generating..."
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
