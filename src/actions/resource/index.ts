"use server";

import { getResourcesByPathPrefix as _getResourcesByPathPrefix } from "@/db/resource";
import sortByPath from "@/utils/sortByPath";

export async function getNearByResources(path: string) {
  const pathPrefix = path.replace(/\d+$/, "");
  return await _getResourcesByPathPrefix(pathPrefix).then(sortByPath);
}
