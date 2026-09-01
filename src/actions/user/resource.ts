"use server";

import { getUserResourceStats as _getUserResourceStats } from "@/db/user/resource";
import { getAuthenticatedUserId } from "@/lib/auth/getAuthenticatedUserId";

export async function getUserResourceStats(resourceId: string) {
  const userId = await getAuthenticatedUserId();

  return await _getUserResourceStats(resourceId, userId);
}
