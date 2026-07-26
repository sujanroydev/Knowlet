import SetPasswordPage from "./SetPasswordPage";
import { notFound } from "next/navigation";

export default async function page({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode } = await params;

  if (mode === "set") {
    return <SetPasswordPage />;
  }

  notFound();
}