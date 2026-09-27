"use server";

import {
  getPapers as _getPapers,
  insertPaper as _insertPaper,
} from "@/db/resource/paper";
import { getAuthenticatedUserId } from "@/lib/auth/getAuthenticatedUserId";
import { NewPaper } from "@/types/resource/paper";

export async function getPapers(subjectId: string) {
  return _getPapers(subjectId);
}

export async function insertPaper_(newPaper: NewPaper) {
  await getAuthenticatedUserId();
  return _insertPaper(newPaper);
}
