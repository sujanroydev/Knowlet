import connectDb from "@/lib/db";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:knowlet.official@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function sendNotification({
  title,
  subscription,
  options: o,
}: {
  title: string;
  subscription: webpush.PushSubscription;
  options: NotificationOptions & { image?: string };
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

  const payload = JSON.stringify({
    notificationId: o.data.id,
    ...notificationData,
  });

  await webpush.sendNotification(subscription, payload);
  return { success: true };
}

export async function sendNotificationByUserId({
  title,
  user_id,
  options,
}: {
  title: string;
  user_id: string;
  options: NotificationOptions & { image?: string };
}) {
  const db = await connectDb();

  const { data, error } = await db
    .from("push_subscriptions")
    .select("id, endpoint, auth, p256dh")
    .eq("user_id", user_id)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("User Doesn't Exist");

  const subscription: webpush.PushSubscription = {
    endpoint: data.endpoint,
    keys: { auth: data.auth, p256dh: data.p256dh },
  };

  sendNotification({ title, subscription, options });
}
