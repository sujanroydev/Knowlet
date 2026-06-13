import connectDb from "@/lib/db";
import ReportStatusForm from "./report-status-form";
import Link from "next/link";

type Report = {
  id: string;

  reason: string;
  details: string | null;

  status: "open" | "reviewed" | "resolved" | "dismissed";

  created_at: string;

  resource: {
    id: string;
    title: string;
    path: string;
  } | null;

  user: {
    id: string;
    name: string;
    picture: string | null;
  } | null;
};

export default async function ReportsPage() {
  const db = await connectDb();

  const { data, error } = await db
    .from("resource_reports")
    .select(
      `
      id,
      reason,
      details,
      status,
      created_at,

      resource:resources (
        id,
        title,
        path
      ),

      user:users (
        id,
        name,
        picture
      )
    `,
    )
    .order("created_at", {
      ascending: false,
    });

  const reports = data as Report[] | null;

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900 dark:bg-red-950/30">
          Failed to load reports.
        </div>
      </div>
    );
  }

  async function updateReportStatus(formData: FormData) {
    "use server";

    const db = await connectDb();

    const reportId = formData.get("reportId") as string;

    const status = formData.get("status") as string;

    await db
      .from("resource_reports")
      .update({
        status,
      })
      .eq("id", reportId);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Resource Reports</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Review and resolve reported issues.
        </p>
      </div>

      {!reports?.length ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <p className="text-muted-foreground">No reports submitted yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
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

                      <span>
                        {new Date(report.created_at).toLocaleDateString()}
                      </span>
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
                        className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-gray-100 inline-flex h-9 items-center justify-center rounded-xl border px-4 text-sm font-medium transition hover:bg-muted"
                      >
                        Open
                      </Link>

                      <Link
                        href={`/dashboard/resources/update/${report.resource.id}`}
                        className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-gray-100 inline-flex h-9 items-center justify-center rounded-xl border px-4 text-sm font-medium transition hover:bg-muted"
                      >
                        Update
                      </Link>
                    </>
                  )}

                  <ReportStatusForm
                    reportId={report.id}
                    currentStatus={report.status}
                    updateReportStatus={updateReportStatus}
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
      )}
    </div>
  );
}
