import connectDb from "@/lib/db";
import StatsBlock from "./Block";
import { parseResourcePath } from "@/components/dashboard/resources/utils";

type HistoryItem = {
  created_at: string;
  path: string;
};

function getLevelData(history: HistoryItem[]) {
  const xp = calculateXp(history);

  let level = 1;
  let required = 30;
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
    progressPercent: Math.min(progressPercent, 100).toFixed(2),
  };
}

function calculateXp(history: HistoryItem[]) {
  if (!history.length) return 0;

  let bft = 0;
  let bfts = 0;

  const sortedByDate = [...history].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  const parsePart = (part: string) => {
    const match = part.match(/^([a-zA-Z-]+)-(\d+)$/);
    if (!match) return { text: part, num: null };
    return {
      text: match[1],
      num: Number(match[2]),
    };
  };

  const sortedByPath = [...history].sort((a, b) => {
    const aParts = a.path.split("/");
    const bParts = b.path.split("/");

    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aP = parsePart(aParts[i] ?? "");
      const bP = parsePart(bParts[i] ?? "");

      const textDiff = aP.text.localeCompare(bP.text);
      if (textDiff !== 0) return textDiff;

      if (aP.num !== null && bP.num !== null) {
        const numDiff = aP.num - bP.num;
        if (numDiff !== 0) return numDiff;
      }

      const fallback = aParts[i].localeCompare(bParts[i]);
      if (fallback !== 0) return fallback;
    }

    return 0;
  });

  let xp = history.length;

  let streakForTime = 0;
  let lastTime = 0;
  const FIVE_MIN = 5 * 60 * 1000;

  for (const item of sortedByDate) {
    const time = new Date(item.created_at).getTime();

    if (lastTime && time - lastTime <= FIVE_MIN) {
      streakForTime += 1;
    } else {
      streakForTime = 0;
    }

    lastTime = time;

    const streakBonus = Math.min(streakForTime * 0.5, 3);
    // console.log(streakBonus);
    xp += streakBonus;
  }
  bft = xp - history.length;

  let streakForPath = 0;
  let lastTargetSlug = "";

  for (const item of sortedByPath) {
    const { targetSlug } = parseResourcePath(item.path);
    const calculatedTargetSlug =
      lastTargetSlug.split("-")[0] +
      "-" +
      (Number(lastTargetSlug.split("-")[1]) + 1);

    // console.log("calculatedTargetSlug: ", calculatedTargetSlug);
    // console.log("targetSlug: ", targetSlug);

    if (lastTargetSlug && calculatedTargetSlug === targetSlug) {
      streakForPath += 1;
      // console.log(item.path);
    } else {
      streakForPath = 0;
    }
    // TODO: also give bonus for same after 10 min

    lastTargetSlug = targetSlug;

    const streakBonus = Math.min(streakForPath * 0.5, 5);
    // console.log(streakBonus);
    xp += streakBonus;
  }
  bfts = xp - history.length - bft;

  console.log(sortedByPath);
  console.log("%d + %d + %d = %d", history.length, bft, bfts, xp);

  return xp;
}

export default async function LevelBlock({ userId }: { userId: string }) {
  const db = await connectDb();
  const { data, error } = await db
    .from("view_history")
    .select("created_at, resources(path)")
    .eq("user_id", userId);

  if (error) return;

  const history = (data as any[])?.map((i) => ({
    created_at: i.created_at,
    path: i.resources.path,
  }));

  const levelData = getLevelData(history);
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
