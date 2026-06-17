import { verifyJwt } from "@/lib/auth";
import connectDb from "@/lib/db";
import { cookies } from "next/headers";

export default async function StatsSection() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const { ok, payload } = await verifyJwt(token);

  if (!ok) return;

  const userId = payload.user_id;
  const db = await connectDb();

  const [likes, bookmarks] = await Promise.all([
    db
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    db
      .from("bookmarks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  let stats = [
    { label: "Likes", value: likes.count },
    { label: "Bookmarks", value: bookmarks.count },
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow-md space-y-6">
      <h2 className="font-semibold border-l-4 border-blue-600 pl-3">
        Your Learning Stats
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-gray-50 p-4 rounded-lg text-center shadow-sm"
          >
            <div className="text-xl font-semibold">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
