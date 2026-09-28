import { cookies } from "next/headers";
import { Lock } from "lucide-react";

import { getUserNotifications } from "@/db/user/notification";
import { getPushSubscriptionsByUserId } from "@/db/pushSubscription";
import NotificationClient from "./notification-client";
import AuthErrorScreen from "@/app/api/auth/AuthErrorScreen";
import { verifyAccessToken } from "@/lib/auth/tokens";

export default async function NotificationsPage() {
  const accessToken = (await cookies()).get("access_token")?.value;
  const payload = await verifyAccessToken(accessToken);

  if (!payload) {
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
