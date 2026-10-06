"use server";

import { getUserNotifications } from "@/db/user/notification";
import { getPushSubscriptionsByUserId } from "@/db/pushSubscription";
import NotificationClient from "./notification-client";
import { getAuthenticatedUserId } from "@/lib/auth/getAuthenticatedUserId";

export default async function NotificationsPage() {
  const userId = await getAuthenticatedUserId();

  const [notifications, subscriptions] = await Promise.all([
    getUserNotifications(userId),
    getPushSubscriptionsByUserId(userId),
  ]);

  return (
    <NotificationClient
      notifications={notifications || []}
      user_subscriptions={subscriptions || []}
    />
  );
}
