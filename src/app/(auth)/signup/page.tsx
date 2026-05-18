import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create Account | Knowlet",

  description:
    "Create a Knowlet account to save bookmarks, track learning history, and access personalized study tools.",

  alternates: {
    canonical: "https://knowlet.in/signup",
  },

  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupPage() {
  return (
    <main className="min-h-[calc(100dvh-120px)] flex items-center justify-center bg-gray-100 p-4">
      <AuthCard title="Create Account">
        <SignupForm />
      </AuthCard>
    </main>
  );
}
