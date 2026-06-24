"use client";

import { Resource } from "@/types/resource";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function ResourceActions({
  resource,
  action,
}: {
  resource: Resource | undefined;
  action: "create" | "update";
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentResource, setCurrentResource] = useState(resource);
  const lastResource = useRef(resource);

  async function publichResource() {
    if (!validateResource()) return;

    setLoading(true);
    const res = await fetch("/api/resources", {
      method: "POST",
      body: JSON.stringify(resource),
    });

    const { error } = await res.json();
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (!res.ok) return;

    const url = `https://knowlet.in/library/${resource?.path}`;

    toast.success("Resource Published Successfully.", {
      description: "The resource is live and ready to view.",
      action: {
        label: "Open",
        onClick: () => window.open(url, "_blank"),
      },
      cancel: {
        label: "Copy",
        onClick: async () => {
          await navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard");
        },
      },
    });
  }

  async function updateResource() {
    if (!validateResource()) return;

    if (!resource?.id) {
      toast.error("can't update resource without id");
      console.log("Resource ID is missing:", resource);
      return;
    }

    if (
      JSON.stringify(currentResource) === JSON.stringify(lastResource.current)
    ) {
      toast.warning("No changes were made.");
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/resources/${resource.id}`, {
      method: "PUT",
      body: JSON.stringify(resource),
    });

    const { error } = await res.json();
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (!res.ok) return;

    const url = `https://knowlet.in/library/${resource?.path}`;

    toast.success("Resource Updated Successfully.", {
      description: "The resource is live and ready to view.",
      action: {
        label: "Open",
        onClick: () => window.open(url, "_blank"),
      },
      cancel: {
        label: "Copy",
        onClick: async () => {
          await navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard");
        },
      },
    });
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

  useEffect(() => {
    lastResource.current = currentResource;
    setCurrentResource(resource);
  }, [resource]);

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

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <button className="w-full rounded-2xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100 sm:w-44">
          Save Draft
        </button>

        <button
          onClick={action === "create" ? publichResource : updateResource}
          className="w-full rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 sm:w-44"
        >
          {loading
            ? action === "create"
              ? "Publishing..."
              : "Updating..."
            : action === "create"
              ? "Publish Resource"
              : "Update Resource"}
        </button>
      </div>
    </div>
  );
}
