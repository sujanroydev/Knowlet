import ForgotPasswordPage from "./ForgotPasswordPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Knowlet",

  description:
    "Reset your Knowlet account password and regain access to your study resources and bookmarks.",

  alternates: {
    canonical: "https://knowlet.in/forgot-password",
  },

  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <ForgotPasswordPage />;
}
