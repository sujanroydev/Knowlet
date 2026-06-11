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
