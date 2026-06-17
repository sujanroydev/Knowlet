import connectDb from "@/lib/db";
import StatsBlock from "./Block";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

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

  while (studiedDays.has(date.toISOString().slice(0, 10))) {
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
  const days = [];
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  });

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);

    days.push({
      day: formatter.format(d)[0], // M,T,W,T,F,S,S
      active: studiedDays.has(d.toISOString().slice(0, 10)),
    });
  }

  return {
    currentStreak,
    longestStreak,
    days,
  };
}

export default async function StreakBlock() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const { ok, payload } = await verifyJwt(token);

  if (!ok) return;

  const db = await connectDb();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 90);

  const { data: history } = await db
    .from("view_history")
    .select("created_at")
    .eq("user_id", payload.user_id)
    .gte("created_at", thirtyDaysAgo.toISOString());

  const streakData = getStreakData(history as HistoryItem[]);

  console.log(streakData);

  const { currentStreak, longestStreak, days } = streakData;
  return (
    <StatsBlock title="7 Day Streak">
      <div className="flex gap-2 mb-3">
        {days.map((d, i) => (
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

      <p className="text-sm font-medium">🔥 {currentStreak} Day Streak</p>

      <p className="text-xs text-gray-500">Best: {longestStreak} days</p>
    </StatsBlock>
  );
}
