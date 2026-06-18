import connectDb from "@/lib/db";
import StatsBlock from "./Block";
import { parseResourcePath } from "@/components/dashboard/resources/utils";

type HistoryItem = {
  created_at: string;
  path: string;
};

const parsePart = (part: string) => {
  const match = part.match(/^([a-zA-Z-]+)-(\d+)$/);
  if (!match) return { text: part, num: null };
  return {
    text: match[1],
    num: Number(match[2]),
  };
};

function getLevelData(history: HistoryItem[]) {
  const xp = calculateXp(history);

  let level = 1;
  let required = 20;
  let previousRequired = 0;

  while (xp >= required) {
    previousRequired = required;
    level++;
    required = Math.floor(required * 1.6);
  }

  const progressPercent =
    ((xp - previousRequired) / (required - previousRequired)) * 100;

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

  const uniqueHistory = [...new Set(history.map((i) => i.path))];

  const sortedHistory = [...uniqueHistory].sort((a, b) => {
    const aParts = a.split("/");
    const bParts = b.split("/");

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

  let xp = uniqueHistory.length;

  let streak = 0;
  let lastSlug = "";

  for (const item of sortedHistory) {
    const path = item;
    const { paperSlug } = parseResourcePath(path);
    const parts = path.split("/");
    const slug = parts.slice(0, paperSlug ? 3 : 2).join("/");

    if (lastSlug && lastSlug === slug) {
      streak += 1;
    } else {
      streak = 0;
    }

    lastSlug = slug;
    xp += Math.min(streak * 0.5, 5);
  }

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
