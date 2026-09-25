"use server";

import {
  getResourcesByPathPrefix as _getResourcesByPathPrefix,
  getResourceCounts as _getResourceCounts,
  insertResource as _insertResource,
} from "@/db/resource";

import { getAuthenticatedUserId } from "@/lib/auth/getAuthenticatedUserId";
import { NewResource } from "@/types/resource";
import sortByPath from "@/utils/sortByPath";

export async function getNearByResources(path: string) {
  const pathPrefix = path.replace(/\d+$/, "");
  return await _getResourcesByPathPrefix(pathPrefix).then(sortByPath);
}

export async function getResourceCounts(resourceId: string) {
  return await _getResourceCounts(resourceId);
}

export async function insertResource(newResource: NewResource) {
  await getAuthenticatedUserId();
  return _insertResource(newResource);
}
