import { getAuthenticatedUserId } from "@/lib/auth/getAuthenticatedUserId";
import LevelBlock from "./Stats/Level";
import StreakBlock from "./Stats/Streak";

export default async function StatsSection() {
  const userId = await getAuthenticatedUserId();

  return (
    <div className="bg-card p-5 rounded-xl shadow-md space-y-6">
      <h2 className="font-semibold border-l-4 border-blue-600 pl-3">
        Your Learning Stats
      </h2>

      <StreakBlock userId={userId} />
      <LevelBlock userId={userId} />
    </div>
  );
}
