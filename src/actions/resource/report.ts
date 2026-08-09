"use server";

import {
  updateReportStatus as _updateReportStatus,
} from "@/db/resource/report";

export async function updateReportStatus(reportId: string, status: string) {
  try {
    return await _updateReportStatus(reportId, status);
  } catch(error) {
    console.error("Failed to ipdate teport status", error);
  }
}
