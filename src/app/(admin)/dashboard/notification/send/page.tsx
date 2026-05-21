import NotificationAdminPage from "@/components/dashboard/notification/notification-admin-page";
import { verifyAdmin } from "@/lib/auth";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const admin = await verifyAdmin(cookieStore.get("token")?.value);

  if (!admin) return notFound();

  return <NotificationAdminPage />;
}
