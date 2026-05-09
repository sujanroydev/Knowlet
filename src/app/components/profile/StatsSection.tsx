const stats = [
  { label: "Comments", value: 0 },
  { label: "Likes", value: 0 },
  { label: "Ratings", value: 0 },
  { label: "Favorites", value: 0 },
];

export default function StatsSection() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md space-y-6">
      <h2 className="font-semibold border-l-4 border-blue-600 pl-3">
        Your Learning Stats
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-gray-50 p-4 rounded-lg text-center shadow-sm"
          >
            <div className="text-xl font-semibold">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
