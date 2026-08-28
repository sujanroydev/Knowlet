"use server";

import {
  getBookmarks as _getBookmarks,
  deleteBookmark,
  insertBookmark,
} from "@/db/user/bookmark";
import { getAuthenticatedUserId } from "@/lib/auth/getAuthenticatedUserId";

export async function getBookmarks() {
  const userId = await getAuthenticatedUserId();

  return await _getBookmarks(userId);
}

export async function bookmarkResource(resourceId: string) {
  const userId = await getAuthenticatedUserId();

  if (!resourceId) throw new Error("Missing resource id");

  await insertBookmark(userId, resourceId);
}

export async function unbookmarkResource(resourceId: string) {
  const userId = await getAuthenticatedUserId();

  if (!resourceId) throw new Error("Missing resource id");

  await deleteBookmark(userId, resourceId);
}
