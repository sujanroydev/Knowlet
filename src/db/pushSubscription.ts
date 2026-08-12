import { supabase } from "@/lib/supabase";

export async function getPushSubscriptionsByUserId(userIds:string | string[]) {
  const ids = Array.isArray(userIds) ? userIds : [userIds];

  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("id, user_id, endpoint, auth, p256dh")
    .in("user_id", ids);

  if (error) throw error;

  return data;
}

export async function deactivatePushSubscription(subscriptionId: string) {
  const { error } = await supabase
    .from("push_subscriptions")
    .update({ is_active: false })
    .eq("id", subscriptionId);

  if (error) throw error;
}
