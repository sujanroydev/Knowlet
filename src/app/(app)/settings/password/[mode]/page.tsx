import SetPasswordPage from "./SetPasswordPage";
import ChangePasswordPage from "./ChangePasswordPage";
import ForgotPasswordPage from "@/app/(auth)/forgot-password/ForgotPasswordPage";
import { notFound } from "next/navigation";

export default async function page({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode } = await params;

  if (mode === "set") return <SetPasswordPage />
  else if (mode === "reset") return <ForgotPasswordPage />
  else if (mode === "change") return <ChangePasswordPage />

  notFound();
}