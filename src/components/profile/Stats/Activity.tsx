import { getUserLikesCount } from "@/db/user/like";
import { getUserBookmarksCount } from "@/db/user/bookmark";
import { getUserViewHistoryCount } from "@/db/user/history";
import StatsBlock from "./Block";

export default async function ActivityBlock({ userId }: { userId: string }) {
  const [likesCount, bookmarksCount, historyCount] = await Promise.all([
    getUserLikesCount(userId),
    getUserBookmarksCount(userId),
    getUserViewHistoryCount(userId),
  ]);

  let stats = [
    { label: "Likes", value: likesCount },
    { label: "Bookmarks", value: bookmarksCount },
    { label: "History", value: historyCount },
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
