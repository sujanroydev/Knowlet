"use server";

import { markNotificationAsRead as _markNotificationAsRead } from "@/db/user/notification";
import { getAuthenticatedUserId } from "@/lib/auth/getAuthenticatedUserId";

export async function markNotificationAsRead(notificationId: string) {
  const userId = await getAuthenticatedUserId();

  return await _markNotificationAsRead(userId, notificationId);
}
