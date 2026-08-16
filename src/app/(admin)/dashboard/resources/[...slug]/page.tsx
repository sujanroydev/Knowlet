import ResourceEditor from "@/components/dashboard/resources/editor";
import AIAssistant from "@/components/nexus/AIAssistant";
import { getResourceById } from "@/db/resource";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResourceEditorProvider } from "@/context/ResourceEditorContext";

export const metadata: Metadata = {
  title: "Resource Editor | Knowlet",
  description: "Create, edit, and manage resources.",

  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const action = slug[0] as "create" | "update";

  if (
    (action !== "create" && action !== "update") ||
    (action === "update" && slug.length !== 2)
  ) {
    notFound();
  }

  if (action === "update") {
    const resource_id = slug[1];

    const resource = await getResourceById(resource_id);

    if (!resource) notFound();

    return (
      <ResourceEditorProvider action={action} resource={resource} >
        <ResourceEditor />
        <AIAssistant />
      </ResourceEditorProvider>
    );
  }

  return (
    <ResourceEditorProvider action="create" >
      <ResourceEditor />
      <AIAssistant />
    </ResourceEditorProvider>
  );
}
