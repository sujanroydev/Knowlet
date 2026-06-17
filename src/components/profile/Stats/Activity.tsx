import connectDb from "@/lib/db";
import StatsBlock from "./Block";

export default async function ActivityBlock({ userId }: { userId: string }) {
  const db = await connectDb();

  const [likes, bookmarks, history] = await Promise.all([
    db
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    db
      .from("bookmarks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    db
      .from("view_history")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  let stats = [
    { label: "Likes", value: likes.count },
    { label: "Bookmarks", value: bookmarks.count },
    { label: "History", value: history.count },
  ];

  return (
    <StatsBlock title="Activity">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-gray-100 opacity-40" />

            <div className="relative flex flex-col items-center text-center">
              <div className="text-2xl font-bold tracking-tight text-gray-900">
                {s.value}
              </div>

              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </StatsBlock>
  );
}
