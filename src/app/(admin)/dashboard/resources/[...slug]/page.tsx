import CreateResourcePage from "@/components/dashboard/resources/create-resource-page";
import UpdateResourcePage from "@/components/dashboard/resources/update-resource-page";
import { verifyAdmin } from "@/lib/auth";
import connectDb from "@/lib/db";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const cookieStore = await cookies();
  const admin = await verifyAdmin(cookieStore.get("token")?.value);

  if (!admin) redirect("/forbidden");

  const { slug } = await params;

  console.log(slug);

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

    return <UpdateResourcePage resource={resource} />;
  }

  return <CreateResourcePage />;
}
