"use server";

import { getSubjects as _getSubjects } from "@/db/resource/subject";

export async function getSubjects(levelId: string) {
  return _getSubjects(levelId);
}
