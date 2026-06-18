import connectDb from "@/lib/db";
import webpush from "web-push";
import { Options, Subscription } from "./types";

webpush.setVapidDetails(
  "mailto:knowlet.official@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

const db = await connectDb();

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

  const { data: notification, error } = await db
    .from("notifications")
    .insert({
      title: title,
      body: options.body,
      icon: options.icon,
      image: options.image,
      badge: options.badge,
      tag: options.tag,
      action_url: options.data?.action_url,
      type: options.data?.type,
    })
    .select()
    .single();

  if (error) throw error;

  const notificationId = notification.id;
  options.data = { ...options.data, notificationId };

  const payload = JSON.stringify({ title, options });

  const uniqueUserIds = [
    ...new Set(
      subscriptions.map((s) => s.user_id).filter((id): id is string => !!id),
    ),
  ];

  await db.from("user_notifications").insert(
    uniqueUserIds.map((userId) => ({
      user_id: userId,
      notification_id: notificationId,
    })),
  );

  const results = await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(subscription, payload);

        return { success: true };
      } catch (err: any) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          await db
            .from("push_subscriptions")
            .update({ is_active: false })
            .eq("id", subscription.id);
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

  await db
    .from("notifications")
    .update(notificationStats)
    .eq("id", notificationId);

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
  const db = await connectDb();

  const { data, error } = await db
    .from("push_subscriptions")
    .select("id, user_id, endpoint, auth, p256dh")
    .eq("user_id", user_id);

  if (error) throw error;
  if (!data.length) throw new Error("Subscription Doesn't Exist");

  const subscriptions: Subscription[] = data.map((row) => ({
    id: row.id,
    endpoint: row.endpoint,
    keys: { auth: row.auth, p256dh: row.p256dh },
    user_id: row.user_id,
  }));

  const notificationStats = sendNotification({
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
  const db = await connectDb();

  const { data, error } = await db
    .from("users")
    .select("id")
    .eq("email", emailId);

  if (error) throw error;

  if (!data.length) throw new Error("User Doesn't Exist");

  const users = data.map((i) => i.id) as string[];

  const notificationStats = sendNotificationByUserId({
    title,
    user_id: users,
    options,
  });

  return notificationStats;
}
