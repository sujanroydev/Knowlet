import { PushSubscription } from "web-push";

export interface Subscription extends PushSubscription {
  id: string;
  user_id: string;
}

export interface Options extends NotificationOptions {
  image?: string;
}
