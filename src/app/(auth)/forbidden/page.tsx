import AuthErrorScreen from "@/app/api/auth/AuthErrorScreen";
import { ShieldAlert, Lock } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <AuthErrorScreen
      code="403"
      title="Access Denied"
      message="You are signed in, but your account does not have permission to access this admin page."
      icon={<ShieldAlert size={18} />}
      footer="Knowlet Admin Security Layer"
      actions={[
        {
          label: "Go Home",
          href: "/",
          variant: "primary",
          icon: <Lock size={16} />,
        },
        {
          label: "Contact Support",
          href: "/help",
          variant: "secondary",
        },
      ]}
    />
  );
}
