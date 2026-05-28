"use client";

import { useTransition } from "react";

const STATUS_OPTIONS = ["open", "reviewed", "resolved", "dismissed"];

type Props = {
  reportId: string;
  currentStatus: string;
  updateReportStatus: (formData: FormData) => Promise<void>;
};

export default function ReportStatusForm({
  reportId,
  currentStatus,
  updateReportStatus,
}: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <form action={updateReportStatus}>
      <input type="hidden" name="reportId" value={reportId} />

      <select
        name="status"
        defaultValue={currentStatus}
        disabled={isPending}
        className="
          rounded-xl border
          bg-background
          px-3 py-2
          text-sm
          outline-none
        "
        onChange={(e) => {
          const form = e.currentTarget.form;

          if (!form) return;

          startTransition(() => {
            form.requestSubmit();
          });
        }}
      >
        {STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </form>
  );
}
