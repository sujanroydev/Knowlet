import connectDb from "@/lib/db";
import ReportStatusForm from "./report-status-form";

const STATUS_OPTIONS = ["open", "reviewed", "resolved", "dismissed"];

export default async function ReportsPage() {
  const db = await connectDb();

  const { data: reports, error } = await db
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
        title
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

                <ReportStatusForm
                  reportId={report.id}
                  currentStatus={report.status}
                  updateReportStatus={updateReportStatus}
                />
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
