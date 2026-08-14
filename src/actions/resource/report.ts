"use server";

import {
  updateReportStatus as _updateReportStatus,
} from "@/db/resource/report";

export async function updateReportStatus(reportId: string, status: string) {
  return await _updateReportStatus(reportId, status);
}
