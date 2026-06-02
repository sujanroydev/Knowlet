import connectDb from "@/lib/db";

export async function getUserDetails(user_id: string) {
  if (!user_id) {
    throw new Error("User ID is required");
  }

  const db = await connectDb();

  const { data: user, error } = await db
    .from("users")
    .select("*")
    .eq("id", user_id)
    .single();

  if (error || !user) {
    throw new Error("User not found");
  }

  return user;
}
