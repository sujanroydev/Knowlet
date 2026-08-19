import { supabase } from "@/lib/supabase";

export async function createUserNotifications(
  userIds: string[],
  notificationId: string,
) {
  const { error } = await supabase
    .from("user_notifications")
    .insert(userIds.map((userId) => ({
      user_id: userId,
      notification_id: notificationId,
    })),
  );

  if (error) throw error;
}

export async function getUserNotifications(
  userId: string,
) {
  const { data, error } = await supabase
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
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function markNotificationAsRead(
  userId: string,
  notificationId: string,
) {
  const { error } = await supabase
    .from("user_notifications")
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq("notification_id", notificationId)
    .eq("user_id", userId);

  if (error) throw error;
}
