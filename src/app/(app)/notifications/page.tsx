import connectDb from "@/lib/db";
import { cookies } from "next/headers";
import { verifyUser } from "@/lib/auth";
import NotificationClient from "./notification-client";
import { Lock, UserX } from "lucide-react";
import AuthErrorScreen from "@/app/api/auth/AuthErrorScreen";

export default async function NotificationsPage() {
  const token = (await cookies()).get("token")?.value;
  const { ok, payload, reason } = await verifyUser(token);

  if (!ok) {
    switch (reason) {
      case "INACTIVE":
        return (
          <AuthErrorScreen
            code="403"
            title="Account Inactive"
            message="Your account is currently inactive. Please contact support for assistance."
            icon={<UserX size={18} />}
            actions={[
              { label: "Contact Support", href: "/help", variant: "primary" },
              { label: "Go Home", href: "/" },
            ]}
            footer="Knowlet Account System"
          />
        );

      default:
        return (
          <AuthErrorScreen
            code="401"
            title="Unauthorized"
            message="You are not authorized to view this page. Please log in to continue."
            icon={<Lock size={18} />}
            actions={[
              { label: "Sign In", href: "/signin", variant: "primary" },
              { label: "Go Home", href: "/" },
            ]}
            footer="Knowlet Authentication Layer"
          />
        );
    }
  }

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
