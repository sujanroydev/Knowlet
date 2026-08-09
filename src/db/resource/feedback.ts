import { supabase } from "@/lib/supabase";
import { Feedback } from "@/schemas/resource/feedback";

export async function fetchResourceFeedbacks(
  from = 0,
  to = 49,
) {
  const { data, error } = await supabase
    .from("resource_feedback")
    .select(
      `
        id,
        message,
        created_at,
        resource: resources (
          id,
          title
        ),
        user: users (
          id,
          name,
          picture
        )
      `,
    )
    .order("created_at", {
      ascending: false,
    })
    .range(from, to);

  if (error) throw error;

  return data as unknown as Feedback[];
}
