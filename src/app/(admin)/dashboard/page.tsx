import Link from "next/link";
import connectDb from "@/lib/db";
import { Bell, BookOpen, Clock3, Eye, Mail, Plus } from "lucide-react";

type Resource = {
  id: string;
  title: string;
  type: string;
  path: string;
  views: number;
  likes: number;
  bookmarks: number;
  feedbacks: number;
  reports: number;
};

type ResourceCardProps = {
  resource: Resource;
};

function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <div className="relative group block rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg">
      <div className="absolute top-4 right-4 flex gap-2">
        <Link
          href={`/library/${resource.path}`}
          className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-gray-100 inline-flex h-9 items-center justify-center rounded-xl border px-4 text-sm font-medium transition hover:bg-muted"
        >
          Open
        </Link>

        <Link
          href={`/dashboard/resources/update/${resource.id}`}
          className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-gray-100 inline-flex h-9 items-center justify-center rounded-xl border px-4 text-sm font-medium transition hover:bg-muted"
        >
          Update
        </Link>
      </div>

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
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t pt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Eye size={14} />
          <span>{resource.views}</span>
        </div>

        <div className="flex items-center gap-1">
          <span>❤️</span>
          <span>{resource.likes}</span>
        </div>

        <div className="flex items-center gap-1">
          <span>🔖</span>
          <span>{resource.bookmarks}</span>
        </div>

        <div className="flex items-center gap-1">
          <span>💬</span>
          <span>{resource.feedbacks}</span>
        </div>

        <div className="flex items-center gap-1 text-red-500">
          <span>⚠️</span>
          <span>{resource.reports}</span>
        </div>
      </div>
    </div>
  );
}

type ResourceSectionProps = {
  title: string;
  icon: React.ReactNode;
  resources: Resource[];
  error?: Error | null;
};

function ResourceSection({
  title,
  icon,
  resources,
  error,
}: ResourceSectionProps) {
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

      {error ? (
        <div
          className="
            rounded-2xl border
            border-red-200 bg-red-50
            py-12 text-center
            text-sm text-red-600
          "
        >
          Failed to load resources
        </div>
      ) : resources.length === 0 ? (
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

interface ActionCardProps {
  href: string;
  category: string;
  title: string;
  icon: React.ReactNode;
}

const actions = [
  {
    href: "/dashboard/resources/create",
    category: "Content",
    title: "Add Resource",
    icon: <Plus size={20} />,
  },
  {
    href: "/dashboard/mail",
    category: "Mail",
    title: "Mail Box",
    icon: <Mail size={20} />,
  },
  {
    href: "/dashboard/notification/send",
    category: "Notifications",
    title: "Push Notifications",
    icon: <Bell size={20} />,
  },
  {
    href: "/dashboard/feedback",
    category: "User Insights",
    title: "Feedback",
    icon: "💬",
  },
  {
    href: "/dashboard/reports",
    category: "Moderation",
    title: "Reports",
    icon: "⚠️",
  },
];

function ActionCard({ href, category, title, icon }: ActionCardProps) {
  return (
    <Link
      href={href}
      className="
        group rounded-3xl border border-gray-200
        bg-white p-5 shadow-sm transition
        hover:-translate-y-1 hover:shadow-lg
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{category}</p>
          <h3 className="mt-1 text-lg font-semibold text-gray-900">{title}</h3>
        </div>

        <div className="rounded-2xl bg-black p-3 text-white">{icon}</div>
      </div>
    </Link>
  );
}

export default async function DashboardPage() {
  const db = await connectDb();

  const [
    { data: mostVisitedResources, error: mostVisitedResourcesError },
    { data: recentResources, error: recentResourcesError },
  ] = await Promise.all([
    db.rpc("get_most_visited_resources"),
    db.rpc("get_recently_published_resources"),
  ]);

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
          </div>
        </div>

        {/* Admin Actions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <ActionCard
              key={action.href}
              href={action.href}
              category={action.category}
              title={action.title}
              icon={action.icon}
            />
          ))}
        </div>

        {/* Resource Sections */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ResourceSection
            title="Most Visited Resources"
            icon={<Eye size={18} />}
            resources={mostVisitedResources || []}
            error={mostVisitedResourcesError}
          />

          <ResourceSection
            title="Recently Published"
            icon={<Clock3 size={18} />}
            resources={recentResources || []}
            error={recentResourcesError}
          />
        </div>
      </div>
    </div>
  );
}
