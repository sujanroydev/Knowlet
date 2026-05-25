import connectDb from "@/lib/db";
import { cookies } from "next/headers";
import { verifyUser } from "@/lib/auth";
import NotificationClient from "./notification-client";

export default async function NotificationsPage() {
  const token = (await cookies()).get("token")?.value;
  const payload = await verifyUser(token);

  const db = await connectDb();

  const [notificationsRes, subscriptionsRes] = await Promise.all([
    db
      .from("user_notifications")
      .select(
        `
      id,
      is_read,
      read_at,
      created_at,
      notifications (
        id,
        title,
        body,
        icon,
        action_url,
        created_at
      )
    `,
      )
      .eq("user_id", payload?.user_id)
      .order("created_at", { ascending: false }),

    db.from("push_subscriptions").select().eq("user_id", payload?.user_id),
  ]);

  if (notificationsRes.error) {
    console.error("Notifications Error:", notificationsRes.error);
  }

  if (subscriptionsRes.error) {
    console.error("Subscriptions Error:", subscriptionsRes.error);
  }

  const notifications = notificationsRes.data || [];
  const userSubscriptions = subscriptionsRes.data || [];

  return (
    <NotificationClient
      notifications={notifications || []}
      user_subscriptions={userSubscriptions || []}
    />
  );
}
