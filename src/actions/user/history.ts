"use server";

import {
  getHistory as _getHistory,
  addViewHistory as _addViewHistory,
} from "@/db/user/history";
import { getAuthenticatedUserId } from "@/lib/auth/getAuthenticatedUserId";

export async function addViewHistory(resourceId: string) {
  const userId = await getAuthenticatedUserId();

  if (!resourceId) throw new Error("Missing resource id");

  return await _addViewHistory(userId, resourceId);
}

export async function getHistory(limit: number = 100) {
  const userId = await getAuthenticatedUserId();

  return await _getHistory(userId, limit);
}
