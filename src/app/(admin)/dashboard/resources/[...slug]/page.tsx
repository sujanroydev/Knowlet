import ResourceEditor from "@/components/dashboard/resources/editor";
import connectDb from "@/lib/db";
import { notFound } from "next/navigation";

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
    const db = await connectDb();

    const { data, error } = await db
      .from("resources")
      .select(
        `
        id,
        title,
        description,
        content,
        path,
        target,
        type,
        slug
      `,
      )
      .eq("id", resource_id)
      .maybeSingle();

    const resource = data as any;

    if (!resource || resource.length === 0) notFound();

    return <ResourceEditor action={action} resource={resource} />;
  }

  return <ResourceEditor action="create" />;
}
