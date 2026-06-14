"use client";

import type { ReportStatus } from "./types";

const STATUS_OPTIONS: ReportStatus[] = [
  "open",
  "reviewed",
  "resolved",
  "dismissed",
];

type Props = {
  reportId: string;
  currentStatus: ReportStatus;
  onStatusChange: (reportId: string, status: ReportStatus) => void;
};

export default function ReportStatusForm({
  reportId,
  currentStatus,
  onStatusChange,
}: Props) {
  return (
    <select
      name="status"
      className="rounded-xl border bg-background px-3 py-2 text-sm outline-none"
      value={currentStatus}
      onChange={(e) => onStatusChange(reportId, e.target.value as ReportStatus)}
    >
      {STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
