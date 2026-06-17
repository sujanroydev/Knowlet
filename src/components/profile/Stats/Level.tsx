import StatsBlock from "./Block";

export default function LevelBlock() {
  const level = 4;
  const xp = 240;
  const required = 400;

  const progress = (xp / required) * 100;

  return (
    <StatsBlock title="Level">
      <p className="text-sm font-medium mb-2">Level {level}: Researcher</p>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 mt-2">
        {required - xp} XP to next level
      </p>

      <p className="text-xs text-gray-500">{xp} XP</p>
    </StatsBlock>
  );
}
