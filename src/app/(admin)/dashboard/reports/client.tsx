"use client";

import { useState } from "react";
import type { Report, ReportStatus } from "@/schemas/resource/report";
import { updateReportStatus } from "@/actions/resource/report";
import ReportStatusForm from "./report-status-form";
import Link from "next/link";

type Props = {
  initialReports: Report[];
};

export default function ReportsClient({ initialReports }: Props) {
  const [reports, setReports] = useState(initialReports);

  async function handleStatusChange(reportId: string, status: ReportStatus) {
    const previousReports = reports;

    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId ? { ...report, status } : report,
      ),
    );

    try {
      await updateReportStatus(reportId, status);
    } catch {
      setReports(previousReports);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Resource Reports</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Review and resolve reported issues.
        </p>
      </div>
      {reports.map((report) => (
        <div
          key={report.id}
          className="rounded-2xl border bg-card p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div>
                <h2 className="text-base font-semibold">
                  {report.resource?.title || "Unknown Resource"}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{report.user?.name || "Anonymous User"}</span>

                  <span>•</span>

                  <span>{new Date(report.created_at).toISOString()}</span>
                </div>
              </div>

              <div className="inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize">
                {report.reason.replaceAll("_", " ")}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {report.resource && (
                <>
                  <Link
                    href={`/library/${report.resource.path}`}
                    className="inline-flex h-9 items-center justify-center rounded-xl border border-border px-4 text-sm font-medium transition hover:bg-muted hover:shadow-md hover:-translate-y-0.5"
                  >
                    Open
                  </Link>

                  <Link
                    href={`/dashboard/resources/update/${report.resource.id}`}
                    className="inline-flex h-9 items-center justify-center rounded-xl border border-border px-4 text-sm font-medium transition hover:bg-muted hover:shadow-md hover:-translate-y-0.5"
                  >
                    Update
                  </Link>
                </>
              )}

              <ReportStatusForm
                reportId={report.id}
                currentStatus={report.status}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>

          {report.details && (
            <div className="mt-4 rounded-xl bg-muted/40 p-4">
              <p className="whitespace-pre-wrap text-sm leading-7">
                {report.details}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
