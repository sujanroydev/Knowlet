import Link from "next/link";
import connectDb from "@/lib/db";

type ResourceCardProps = {
  resource: any;
};

function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Link
      href={`/library/${resource.path}`}
      className="block rounded-xl border p-4 transition hover:bg-gray-50"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate font-medium">{resource.title}</h3>

          <p className="text-sm text-gray-500">{resource.type}</p>
        </div>

        <div className="shrink-0 text-sm font-medium">
          {resource.views} views
        </div>
      </div>
    </Link>
  );
}

type ResourceSectionProps = {
  title: string;
  resources: any[];
};

function ResourceSection({ title, resources }: ResourceSectionProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>

      {resources.length === 0 ? (
        <div>No resources found</div>
      ) : (
        <div className="space-y-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}

export default async function DashboardPage() {
  const db = await connectDb();

  const [{ data: mostVisitedResources, error }, { data: recentResources }] =
    await Promise.all([
      db.rpc("get_most_visited_resources"),
      db.rpc("get_recently_published_resources"),
    ]);

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

      {/* Side by Side Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ResourceSection
          title="Most Visited Resources"
          resources={mostVisitedResources || []}
        />

        <ResourceSection
          title="Recently Published Resources"
          resources={recentResources || []}
        />
      </div>
    </div>
  );
}
