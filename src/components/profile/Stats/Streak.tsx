import connectDb from "@/lib/db";
import StatsBlock from "./Block";
import { Flame, Trophy, Circle } from "lucide-react";

type HistoryItem = {
  created_at: string;
};

export function getStreakData(history: HistoryItem[]) {
  const uniqueDays = [
    ...new Set(history.map((h) => h.created_at.slice(0, 10))),
  ].sort();

  const studiedDays = new Set(uniqueDays);

  // Current streak
  let currentStreak = 0;
  let date = new Date();
  date.setHours(0, 0, 0, 0);

  while (studiedDays.has(getDateKey(date))) {
    currentStreak++;
    date.setDate(date.getDate() - 1);
  }

  // Longest streak
  let longestStreak = 0;
  let streak = 0;

  for (let i = 0; i < uniqueDays.length; i++) {
    if (i === 0) {
      streak = 1;
    } else {
      const prev = new Date(uniqueDays[i - 1]);
      const curr = new Date(uniqueDays[i]);

      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

      streak = diff === 1 ? streak + 1 : 1;
    }

    longestStreak = Math.max(longestStreak, streak);
  }

  // Last 7 days activity
  function getDateKey(date: Date) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  }

  const days = [];
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  });

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    days.push({
      day: formatter.format(d)[0],
      active: studiedDays.has(getDateKey(d)),
    });
  }
  // TODO: also manage freez streak

  return {
    currentStreak,
    longestStreak,
    days,
  };
}

export default async function StreakBlock({ userId }: { userId: string }) {
  const db = await connectDb();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 90);

  const { data: history } = await db
    .from("view_history")
    .select("created_at")
    .eq("user_id", userId)
    .gte("created_at", thirtyDaysAgo.toISOString());

  const streakData = getStreakData(history as HistoryItem[]);

  return (
    <StatsBlock title="7 Day Streak">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-start gap-2">
          <Flame className="w-5 h-5 text-orange-500 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500">Current streak</p>
            <p className="text-lg font-semibold">
              {streakData.currentStreak} days
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 text-right">
          <Trophy className="w-5 h-5 text-yellow-500 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500">Best</p>
            <p className="text-sm font-medium">
              {streakData.longestStreak} days
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mb-3">
        {streakData.days.map((d, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            {/* ROUND ICON */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                d.active
                  ? "bg-orange-100 text-orange-500 shadow-sm"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {d.active ? (
                <Flame className="w-4 h-4" />
              ) : (
                <Circle className="w-3 h-3" />
              )}
            </div>

            {/* label */}
            <span className="text-[10px] mt-1 text-gray-500">{d.day}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        Keep going — consistency compounds over time.
      </p>
    </StatsBlock>
  );
}
