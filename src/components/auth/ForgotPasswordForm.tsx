"use client";

import { useState } from "react";
import { toast } from "sonner";
import Loader from "@/components/auth/Loader";

export default function ForgotPasswordForm({
  email,
  setEmail,
  onSuccess,
}: {
  email: string;
  setEmail: (v: string) => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error.message);
        return;
      }

      toast.success("OTP sent (if account exists)");
      onSuccess();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <Loader />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="w-full rounded-lg border px-4 py-3"
          required
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
          Send OTP
        </button>
      </form>
    </>
  );
}
