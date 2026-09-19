"use server";

import { getLevels as _getLevels } from "@/db/resource/level";

export async function getLevels() {
  return _getLevels();
}
