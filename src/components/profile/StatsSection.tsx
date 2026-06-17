import StatsActivity from "./Stats/Activity";

export default async function StatsSection() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md space-y-6">
      <h2 className="font-semibold border-l-4 border-blue-600 pl-3">
        Your Learning Stats
      </h2>

      <StatsActivity />
    </div>
  );
}
