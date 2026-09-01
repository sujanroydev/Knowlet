"use server";

import { getNearByResources as _getNearByResources } from "@/db/resource";

export async function getNearByResources(pathPrefix: string) {
  return await _getNearByResources(pathPrefix);
}
