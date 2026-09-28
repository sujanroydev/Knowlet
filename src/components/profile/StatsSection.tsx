import { cookies } from "next/headers";
import LevelBlock from "./Stats/Level";
import StreakBlock from "./Stats/Streak";
import { verifyAccessToken } from "@/lib/auth/tokens";

export default async function StatsSection() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const payload = await verifyAccessToken(accessToken);
  if (!payload) return;

  const userId = payload.user_id;

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
