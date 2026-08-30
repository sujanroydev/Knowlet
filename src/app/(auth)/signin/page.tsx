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
  return (
    <main className="flex min-h-[calc(100dvh-3.75rem)] items-center justify-center bg-background p-4">
      <AuthCard title="Signin">
        <SigninForm />
      </AuthCard>
    </main>
  );
}
