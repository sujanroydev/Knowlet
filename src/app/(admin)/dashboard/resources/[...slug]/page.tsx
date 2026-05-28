import CreateResourcePage from "@/components/dashboard/resources/create-resource-page";
import { verifyAdmin } from "@/lib/auth";
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

  const id = action === "update" ? slug[1] : null;

  return action === "create" ? <CreateResourcePage /> : <CreateResourcePage />;
}
