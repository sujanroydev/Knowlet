import connectDb from "@/lib/db";
import webpush from "web-push";

interface Subscription extends webpush.PushSubscription {
  id: string;
  user_id: string;
}

interface Options extends NotificationOptions {
  image?: string;
}

webpush.setVapidDetails(
  "mailto:knowlet.official@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

const db = await connectDb();

export async function sendNotification({
  title,
  subscription,
  options: o,
}: {
  title: string;
  subscription: Subscription | Subscription[];
  options: Options;
}) {
  const notificationData = {
    title: title,
    body: o.body,
    image: o.image,
    icon: o.icon || "/icons/web-app-manifest-192x192.png",
    badge: o.badge || "/icons/favicon-96x96.png",
    tag: o.tag,
    action_url: o.data.action_url || "https://knowlet.in",
  };

  const subscriptions = Array.isArray(subscription)
    ? subscription
    : [subscription];

  const { data: notification } = await db
    .from("notifications")
    .insert({ type: "resource", ...notificationData })
    .select()
    .single();

  const notificationId = notification.id;
  const payload = JSON.stringify({
    notificationId,
    ...notificationData,
  });

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
    subscriptions.map(async (s) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: s.endpoint,
            keys: { auth: s.keys.auth, p256dh: s.keys.p256dh },
          },
          payload,
        );

        return { success: true };
      } catch (err: any) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          await db
            .from("push_subscriptions")
            .update({ is_active: false })
            .eq("id", s.id);
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
}

export async function sendNotificationByUserId({
  title,
  user_id,
  options,
}: {
  title: string;
  user_id: string;
  options: Options;
}) {
  const db = await connectDb();

  const { data, error } = await db
    .from("push_subscriptions")
    .select("id, user_id, endpoint, auth, p256dh")
    .eq("user_id", user_id)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("User Doesn't Exist");

  const subscription: Subscription = {
    id: data.id,
    endpoint: data.endpoint,
    keys: { auth: data.auth, p256dh: data.p256dh },
    user_id: data.user_id,
  };

  sendNotification({ title, subscription, options });
}
