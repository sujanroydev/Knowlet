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
