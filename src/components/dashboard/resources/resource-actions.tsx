import { toast } from "sonner";

export default function ResourceActions({
  resource,
}: {
  resource: Resource | undefined;
}) {
  async function publichResource() {
    console.log(resource);
    if (!resource) {
      toast.error("can't publish empty resource");
      return;
    }

    if (resource.content.length < 200) {
      toast.info("resource must be of 200 char");
      return;
    }

    const values = Object.values(resource);

    if (
      values.includes("select") ||
      resource.path.split("/").includes("select") ||
      values.includes(null) ||
      values.includes(undefined)
    ) {
      toast.warning("all fields are required");
      return;
    }

    const res = await fetch("/api/resources", {
      method: "POST",
      body: JSON.stringify(resource),
    });

    const { data, error } = await res.json();

    if (error) {
      toast.error(error.message);
      return;
    }

    if (!res.ok) return;

    toast.success("Resource Published Successfully.");
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Ready to publish?
        </h3>

        <p className="text-sm text-slate-500">
          Save as draft or publish directly to the library.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="rounded-2xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100">
          Save Draft
        </button>

        <button
          onClick={publichResource}
          className="rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Publish Resource
        </button>
      </div>
    </div>
  );
}
