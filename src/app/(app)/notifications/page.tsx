import connectDb from "@/lib/db";
import { cookies } from "next/headers";
import { verifyUser } from "@/lib/auth";
import NotificationClient from "./notification-client";

export default async function NotificationsPage() {
  const token = (await cookies()).get("token")?.value;
  const payload = await verifyUser(token);

  const db = await connectDb();

  const { data: notifications } = await db
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
    .order("created_at", { ascending: false });

  const { data: user_subscriptions, error } = await db
    .from("push_subscriptions")
    .select()
    .eq("user_id", payload?.user_id);

  return (
    <NotificationClient
      notifications={notifications || []}
      user_subscriptions={user_subscriptions || []}
    />
  );
}
