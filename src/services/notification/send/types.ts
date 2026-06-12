import { PushSubscription } from "web-push";

type NotificationType =
  | "system"
  | "resource"
  | "announcement"
  | "reminder"
  | "account";

export interface Subscription extends PushSubscription {
  id: string;
  user_id: string;
}

export interface Options extends NotificationOptions {
  data?: {
    notificationId?: string;
    action_url?: string;
    type?: NotificationType;
  };
  image?: string;
}
