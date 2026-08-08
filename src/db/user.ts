import connectDb from "@/lib/db";

export async function updateUserLastAccessedTime(userId: string) {
  const db = await connectDb();

  const { error } = await db
    .from("users")
    .update({ last_accessed_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) throw error;
}
