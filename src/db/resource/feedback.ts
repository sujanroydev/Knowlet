import { supabase } from "@/lib/supabase";

export async function fetchResourceFeedback(
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
        resources (
          id,
          title
        ),
        users (
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

  return data?.map((feedback) => ({
    ...feedback,
    resource: feedback.resources[0] ?? null,
    user: feedback.users[0] ?? null,
  })) ?? [];
}
