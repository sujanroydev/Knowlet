import CreateResourcePage from "@/components/dashboard/resources/create-resource-page";
import { verifyAdmin } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = await cookies();
  const admin = await verifyAdmin(cookieStore.get("token")?.value);

  if (!admin) redirect("/forbidden");

  return <CreateResourcePage />;
}
