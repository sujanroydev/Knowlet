import StatsBlock from "./Block";

export default function StreakBlock() {
  const currentStreak = 7;
  const longestStreak = 12;

  const days = [
    { day: "M", active: true },
    { day: "T", active: true },
    { day: "W", active: true },
    { day: "T", active: true },
    { day: "F", active: true },
    { day: "S", active: false },
    { day: "S", active: true },
  ];

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
