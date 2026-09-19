"use server";

import { getPapers as _getPapers } from "@/db/resource/paper";

export async function getPapers(subjectId: string) {
  return _getPapers(subjectId);
}
