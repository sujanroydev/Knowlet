"use server";

import {
  getLevels as _getLevels,
  insertLevel as _insertLevel,
} from "@/db/resource/level";
import { getAuthenticatedUserId } from "@/lib/auth/getAuthenticatedUserId";
import { NewLevel } from "@/types/resource/level";

export async function getLevels() {
  return _getLevels();
}

export async function insertLevel_(newLevel: NewLevel) {
  await getAuthenticatedUserId();
  return _insertLevel(newLevel);
}
