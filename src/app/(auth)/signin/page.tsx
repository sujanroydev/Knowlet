import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import SigninForm from "@/components/auth/SigninForm";

export const metadata: Metadata = {
  title: "Sign In | Knowlet",

  description:
    "Sign in to your Knowlet account to access bookmarks, history, and personalized study resources.",

  alternates: {
    canonical: "https://knowlet.in/signin",
  },

  robots: {
    index: false,
    follow: false,
  },
};

export default function SigninPage() {
  // TODO: after login return to previous using query params from url
  return (
    <main className="min-h-[calc(100dvh-120px)] flex items-center justify-center bg-gray-100 p-4">
      <AuthCard title="Signin">
        <SigninForm />
      </AuthCard>
    </main>
  );
}
