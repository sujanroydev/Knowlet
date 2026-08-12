import { supabase } from "@/lib/supabase";

export async function createNotification(notification: {
  title: string;
  body?: string;
  icon?: string;
  image?: string;
  badge?: string;
  tag?: string;
  action_url?: string;
  type?: string;
}) {
  const { data, error } = await supabase
    .from("notifications")
    .insert(notification)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateNotificationStats(
  notificationId: string,
  notificationStats: {
    total_users: number,
    sent_count: number,
    failed_count: number,
  }
) {
  const { error } = await supabase
    .from("notifications")
    .update(notificationStats)
    .eq("id", notificationId);

  if (error) throw error;
}
