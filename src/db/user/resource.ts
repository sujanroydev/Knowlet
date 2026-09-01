import { supabase } from "@/lib/supabase";

export async function getUserResourceState(resourceId: string, userId: string) {
  const { data, error } = await supabase.rpc("get_user_states", {
    res_id: resourceId,
    uid: userId,
  });

  if (error) throw error;

  return data as {
    liked: boolean;
    bookmarked: boolean;
  };
}
