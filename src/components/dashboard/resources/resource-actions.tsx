import { toast } from "sonner";

export default function ResourceActions({
  resource,
  action,
}: {
  resource: Resource | undefined;
  action: "create" | "update";
}) {
  async function publichResource() {
    if (!validateResource()) return;

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

  async function updateResource() {
    if (!validateResource()) return;

    if (!resource?.id) {
      toast.error("can't update resource without id");
      console.log("Resource ID is missing:", resource);
      return;
    }

    const res = await fetch(`/api/resources/${resource.id}`, {
      method: "PUT",
      body: JSON.stringify(resource),
    });

    const { data, error } = await res.json();

    if (error) {
      toast.error(error.message);
      return;
    }

    if (!res.ok) return;

    toast.success("Resource Updated Successfully.");
  }

  function validateResource(): boolean {
    if (!resource) {
      toast.error("can't update empty resource");
      return false;
    }

    if (resource.content.length < 200) {
      toast.info("resource must be of 200 char");
      return false;
    }

    const values = Object.values(resource);

    if (
      values.includes("select") ||
      resource.path.split("/").includes("select") ||
      values.includes(null) ||
      values.includes(undefined)
    ) {
      toast.warning("all fields are required");
      return false;
    }
    return true;
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          {action === "create" ? "Ready to publish?" : "Ready to update?"}
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
          onClick={action === "create" ? publichResource : updateResource}
          className="rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          {action === "create" ? "Publish Resource" : "Update Resource"}
        </button>
      </div>
    </div>
  );
}
