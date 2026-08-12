import webpush from "web-push";

import { Options, Subscription } from "./types";
import { createNotification, updateNotificationStats } from "@/db/notification";
import { createUserNotifications } from "@/db/user/notification";
import { getPushSubscriptionsByUserId, deactivatePushSubscription } from "@/db/pushSubscription";
import { getUserIdsByEmails } from "@/db/user";

webpush.setVapidDetails(
  "mailto:knowlet.official@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function sendNotification({
  title,
  subscription,
  options,
}: {
  title: string;
  subscription: Subscription | Subscription[];
  options: Options;
}) {
  const subscriptions = Array.isArray(subscription)
    ? subscription
    : [subscription];

  const notification = await createNotification({
    title: title,
    body: options.body,
    icon: options.icon,
    image: options.image,
    badge: options.badge,
    tag: options.tag,
    action_url: options.data?.action_url,
    type: options.data?.type,
  })

  const notificationId = notification.id;
  options.data = { ...options.data, notificationId };

  const payload = JSON.stringify({ title, options });

  const uniqueUserIds = [
    ...new Set(
      subscriptions.map((s) => s.user_id).filter((id): id is string => !!id),
    ),
  ];

  await createUserNotifications(uniqueUserIds, notificationId);

  const results = await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(subscription, payload);

        return { success: true };
      } catch (err: any) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          await deactivatePushSubscription(subscription.id);
        }

        return {
          success: false,
          statusCode: err.statusCode,
          message: err.message,
        };
      }
    }),
  );

  const success = results.filter(
    (r) => r.status === "fulfilled" && r.value.success,
  ).length;

  const notificationStats = {
    total_users: subscriptions.length,
    sent_count: success,
    failed_count: subscriptions.length - success,
  };

  await updateNotificationStats(notificationId, notificationStats);

  return notificationStats;
}

export async function sendNotificationByUserId({
  title,
  user_id,
  options,
}: {
  title: string;
  user_id: string | string[];
  options: Options;
}) {
  const subscriptionRows = await getPushSubscriptionsByUserId(user_id);

  if (!subscriptionRows.length) throw new Error("Subscription Doesn't Exist");

  const subscriptions: Subscription[] = subscriptionRows.map((row) => ({
    id: row.id,
    endpoint: row.endpoint,
    keys: { auth: row.auth, p256dh: row.p256dh },
    user_id: row.user_id,
  }));

  const notificationStats = await sendNotification({
    title,
    subscription: subscriptions,
    options,
  });
  return notificationStats;
}

export async function sendNotificationByEmailId({
  title,
  emailId,
  options,
}: {
  title: string;
  emailId: string | string[];
  options: Options;
}) {
  const userId = await getUserIdsByEmails(emailId);

  if (!userId) throw new Error("User Doesn't Exist");

  const notificationStats = sendNotificationByUserId({
    title,
    user_id: userId,
    options,
  });

  return notificationStats;
}
