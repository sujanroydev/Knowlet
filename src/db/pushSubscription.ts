import { supabase } from "@/lib/supabase";
import { PushSubscription } from "web-push";

export async function upsertPushSubscription(
  subscription: PushSubscription,
  userId?: string,
) {
  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: userId ?? null,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      is_active: true,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "endpoint",
    },
  );

  if (error) throw error;
}

export async function getPushSubscriptionsByUserId(userIds: string | string[]) {
  const ids = Array.isArray(userIds) ? userIds : [userIds];

  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("id, user_id, endpoint, auth, p256dh, is_active")
    .in("user_id", ids);

  if (error) throw error;

  return data;
}

export async function getAllPushSubscriptions() {
  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("id, user_id, endpoint, auth, p256dh")
    .eq("is_active", true);

  if (error) throw error;

  return data;
}

export async function deactivatePushSubscription(subscriptionId: string) {
  const { error } = await supabase
    .from("push_subscriptions")
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", subscriptionId);

  if (error) throw error;
}

export async function deactivatePushSubscriptionByEndpoint(
  subscriptionEndpoint: string,
) {
  const { error } = await supabase
    .from("push_subscriptions")
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("endpoint", subscriptionEndpoint);

  if (error) throw error;
}
