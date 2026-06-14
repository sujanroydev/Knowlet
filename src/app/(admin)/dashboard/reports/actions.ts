"use server";

import connectDb from "@/lib/db";

export async function updateReportStatus(reportId: string, status: string) {
  const db = await connectDb();

  const { error } = await db
    .from("resource_reports")
    .update({ status })
    .eq("id", reportId);

  if (error) {
    throw new Error(error.message);
  }
}
