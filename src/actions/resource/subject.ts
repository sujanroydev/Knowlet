"use server";

import {
  getSubjects as _getSubjects,
  insertSubject as _insertSubject,
} from "@/db/resource/subject";
import { getAuthenticatedUserId } from "@/lib/auth/getAuthenticatedUserId";
import { NewSubject } from "@/types/resource/subject";

export async function getSubjects(levelId: string) {
  return _getSubjects(levelId);
}

export async function insertSubject(newSubject: NewSubject) {
  await getAuthenticatedUserId();
  return _insertSubject(newSubject);
}
