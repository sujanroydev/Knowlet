import { cookies } from "next/headers";
import { Lock, UserX } from "lucide-react";

import { verifyUser } from "@/lib/auth";
import { getUserNotifications } from "@/db/user/notification";
import { getPushSubscriptionsByUserId } from "@/db/pushSubscription";
import NotificationClient from "./notification-client";
import AuthErrorScreen from "@/app/api/auth/AuthErrorScreen";

export default async function NotificationsPage() {
  const token = (await cookies()).get("token")?.value;
  const { ok, payload, reason } = await verifyUser(token);

  if (!ok || !payload) {
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

  const [notifications, subscriptions] = await Promise.all([
    getUserNotifications(payload.user_id),
    getPushSubscriptionsByUserId(payload.user_id),
  ]);

  return (
    <NotificationClient
      notifications={notifications || []}
      user_subscriptions={subscriptions || []}
    />
  );
}
