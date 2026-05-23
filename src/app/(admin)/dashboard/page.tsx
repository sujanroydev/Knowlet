import Link from "next/link";
import connectDb from "@/lib/db";
import { ArrowUpRight, Bell, BookOpen, Clock3, Eye, Plus } from "lucide-react";

type Resource = {
  id: string;
  title: string;
  type: string;
  path: string;
  views: number;
};

type ResourceCardProps = {
  resource: Resource;
};

function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Link
      href={`/library/${resource.path}`}
      className="group block rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gray-100 p-2">
              <BookOpen size={16} />
            </div>

            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
              {resource.type}
            </span>
          </div>

          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-black">
            {resource.title}
          </h3>
        </div>

        <ArrowUpRight
          size={18}
          className="shrink-0 text-gray-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-black"
        />
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-3 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Eye size={15} />
          <span>{resource.views}</span>
        </div>

        <span>Open Resource</span>
      </div>
    </Link>
  );
}

type ResourceSectionProps = {
  title: string;
  icon: React.ReactNode;
  resources: Resource[];
};

function ResourceSection({ title, icon, resources }: ResourceSectionProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-black p-2 text-white">{icon}</div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

            <p className="text-sm text-gray-500">
              {resources.length} resources
            </p>
          </div>
        </div>
      </div>

      {resources.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 py-12 text-center text-sm text-gray-500">
          No resources found
        </div>
      ) : (
        <div className="space-y-4">
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
    return <div className="p-6">Failed to load dashboard</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Hero Header */}
        <div className="overflow-hidden rounded-3xl bg-black p-6 text-white shadow-2xl md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur">
                <Clock3 size={14} />
                Admin Dashboard
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Welcome Back
                </h1>

                <p className="mt-2 text-sm text-gray-300 md:text-base">
                  Manage resources, monitor engagement, and publish new content.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard/resources/create"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:scale-[1.02] hover:shadow-lg"
              >
                <Plus size={18} />
                Add Resource
              </Link>

              <Link
                href="/dashboard/notification/send"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 font-medium text-white backdrop-blur transition hover:bg-white/20"
              >
                <Bell size={18} />
                Push Notifications
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Most Visited</p>

            <h3 className="mt-2 text-3xl font-bold">
              {mostVisitedResources?.length || 0}
            </h3>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Recently Published</p>

            <h3 className="mt-2 text-3xl font-bold">
              {recentResources?.length || 0}
            </h3>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Sections</p>

            <h3 className="mt-2 text-3xl font-bold">2</h3>
          </div>
        </div>

        {/* Resource Sections */}
        <div className="grid gap-6 xl:grid-cols-2">
          <ResourceSection
            title="Most Visited Resources"
            icon={<Eye size={18} />}
            resources={mostVisitedResources || []}
          />

          <ResourceSection
            title="Recently Published"
            icon={<Clock3 size={18} />}
            resources={recentResources || []}
          />
        </div>
      </div>
    </div>
  );
}
