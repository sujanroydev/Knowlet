import Link from "next/link";
import connectDb from "@/lib/db";

export default async function DashboardPage() {
  const supabase = await connectDb();

  const { data, error } = await supabase.rpc("get_most_visited_resources");

  if (error) {
    return <div>Failed to load dashboard</div>;
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <Link
          href="/dashboard/resources/create"
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          + Add Resource
        </Link>
      </div>

      {/* Most Visited */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Most Visited Resources</h2>

        {data.length === 0 ? (
          <div>No resources found</div>
        ) : (
          data.map((resource: any) => (
            <Link
              key={resource.id}
              href={`/library/${resource.path}`}
              className="block rounded-xl border p-4 transition hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{resource.title}</h3>

                  <p className="text-sm text-gray-500">{resource.type}</p>
                </div>

                <div className="text-sm font-medium">
                  {resource.views} views
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
