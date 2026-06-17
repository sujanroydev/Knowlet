import connectDb from "@/lib/db";
import StatsBlock from "./Block";

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
      <div className="flex gap-2 mb-3">
        {streakData.days.map((d, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`h-7 w-7 rounded-full border ${
                d.active
                  ? "bg-green-500 border-green-500"
                  : "bg-gray-200 border-gray-300"
              }`}
            />
            <span className="text-xs mt-1 text-gray-500">{d.day}</span>
          </div>
        ))}
      </div>

      <p className="text-sm font-medium">
        🔥 {streakData.currentStreak} Day Streak
      </p>

      <p className="text-xs text-gray-500">
        Best: {streakData.longestStreak} days
      </p>
    </StatsBlock>
  );
}
