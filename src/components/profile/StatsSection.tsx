import { cookies } from "next/headers";
import ActivityBlock from "./Stats/Activity";
import LevelBlock from "./Stats/Level";
import StreakBlock from "./Stats/Streak";
import { verifyJwt } from "@/lib/auth";

export default async function StatsSection() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const { ok, payload } = await verifyJwt(token);
  if (!ok) return;

  const userId = payload.user_id;

  return (
    <div className="bg-white p-5 rounded-xl shadow-md space-y-6">
      <h2 className="font-semibold border-l-4 border-blue-600 pl-3">
        Your Learning Stats
      </h2>

      <ActivityBlock userId={userId} />
      <StreakBlock userId={userId} />
      <LevelBlock userId={userId} />
    </div>
  );
}
