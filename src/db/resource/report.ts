import { supabase } from "@/lib/supabase";
import { Report } from "@/schemas/resource/report";
import { ReportSchema } from "@/schemas/resource/report";

export async function updateReportStatus(reportId: string, status: string) {
  const { error } = await supabase
    .from("resource_reports")
    .update({ status })
    .eq("id", reportId);

  if (error) throw error;
}

export async function fetchResourceReports(
  from = 0,
  to = 49,
) {
  const { data, error } = await supabase
    .from("resource_reports")
    .select(
      `
        id,
        reason,
        details,
        status,
        created_at,
        resource: resources (
          id,
          title,
          path
        ),
        user: users (
          id,
          name,
          picture
        )
      `,
    )
    .order("created_at", {
      ascending: false,
    })
    .range(from, to);

  if (error) throw error;

  return data as unknown as Report[];
}
