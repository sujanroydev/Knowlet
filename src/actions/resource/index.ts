"use server";

import {
  getResourcesByPathPrefix as _getResourcesByPathPrefix,
  getResourceCounts,
} from "@/db/resource";
import { getUserResourceState } from "@/db/user/resource";
import { getAuthenticatedUserId } from "@/lib/auth/getAuthenticatedUserId";
import sortByPath from "@/utils/sortByPath";

export async function getNearByResources(path: string) {
  const pathPrefix = path.replace(/\d+$/, "");
  return await _getResourcesByPathPrefix(pathPrefix).then(sortByPath);
}

export async function getResourceStats(resourceId: string) {
  const userId = await getAuthenticatedUserId();

  const [counts, userState] = await Promise.all([
    getResourceCounts(resourceId),
    getUserResourceState(resourceId, userId),
  ]);

  return { ...(counts ?? {}), ...(userState ?? {}) };
}
