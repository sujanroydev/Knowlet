import connectDb from "@/lib/db";
import StatsBlock from "./Block";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

type HistoryItem = {
  created_at: any;
  path: any;
};

function getLevelData(history: HistoryItem[]) {
  const xp = calculateXp(history);

  let level = 1;
  let required = 40;
  let previousRequired = 0;

  while (xp >= required) {
    previousRequired = required;
    level++;
    required = Math.floor(required * 1.6);
  }

  const progressPercent = ((xp - previousRequired) / required) * 100;

  const levelNames = [
    "Reader",
    "Explorer",
    "Scholar",
    "Analyst",
    "Researcher",
    "Specialist",
    "Authority",
    "Master",
  ];

  const levelName = levelNames[level - 1] || "Legend";

  return {
    level,
    levelName,
    xp,
    previousRequired,
    required,
    progressPercent: Math.min(progressPercent, 100),
  };
}

function calculateXp(history: HistoryItem[]) {
  if (!history.length) return 0;

  const sorted = [...history].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  let xp = 0;
  let streak = 0;

  let lastTime = 0;
  const FIVE_MIN = 5 * 60 * 1000;

  for (const item of sorted) {
    const time = new Date(item.created_at).getTime();
    xp += 1;

    // check continuity (within 5 minutes)
    if (lastTime && time - lastTime <= FIVE_MIN) {
      streak += 1;
    } else {
      streak = 1;
    }

    lastTime = time;

    // streak bonus (capped so it can't be farmed)
    const streakBonus = Math.min(streak * 0.2, 3);
    xp += streakBonus;
  }

  // return history;
  return Math.round(xp);
}

export default async function LevelBlock() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const { ok, payload } = await verifyJwt(token);

  if (!ok) return;

  const db = await connectDb();
  const { data, error } = await db
    .from("view_history")
    .select("created_at, resources(path)")
    .eq("user_id", payload.user_id);

  const history = (data as any[])?.map((i) => ({
    created_at: i.created_at,
    path: i.resources.path,
  }));

  const levelData = getLevelData(history);
  console.log(levelData);
  const { level, levelName, xp, required, progressPercent } = levelData;

  return (
    <StatsBlock title="Level">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-gray-500">Current Level</p>
          <p className="text-lg font-semibold leading-tight">
            {level} · {levelName}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500">XP</p>
          <p className="text-sm font-medium">{xp}</p>
        </div>
      </div>

      <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />

        <div className="absolute inset-0 bg-white/10" />
      </div>

      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-gray-500">
          {required - xp} XP to next level
        </p>

        <p className="text-xs text-gray-400">{progressPercent}% complete</p>
      </div>
    </StatsBlock>
  );
}
