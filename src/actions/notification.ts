"use server";

import { PushSubscription } from "web-push";

import {
  upsertPushSubscription as _upsertPushSubscription,
  deactivatePushSubscriptionByEndpoint as _deactivatePushSubscriptionByEndpoint,
} from "@/db/pushSubscription";
import { markNotificationAsRead as _markNotificationAsRead } from "@/db/user/notification";
import { getAuthenticatedUserId } from "@/lib/auth/getAuthenticatedUserId";

export async function upsertPushSubscription(subscription: PushSubscription) {
  const userId = await getAuthenticatedUserId();

  return await _upsertPushSubscription(subscription, userId);
}

export async function deactivatePushSubscriptionByEndpoint(endpoint: string) {
  return await _deactivatePushSubscriptionByEndpoint(endpoint);
}

export async function markNotificationAsRead(notificationId: string) {
  const userId = await getAuthenticatedUserId();

  return await _markNotificationAsRead(userId, notificationId);
}
