import connectDb from "@/lib/db";

export async function getUserEmail(user_id: string): Promise<string> {
  if (!user_id) {
    throw new Error("User ID is required");
  }

  const db = await connectDb();

  const { data: user, error } = await db
    .from("users")
    .select("email")
    .eq("id", user_id)
    .single();

  if (error || !user) {
    throw new Error("User not found");
  }

  if (!user.email) {
    throw new Error("User has no email address");
  }

  return user.email;
}
