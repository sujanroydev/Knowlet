"use client";

import { useState } from "react";
import { toast } from "sonner";
import Loader from "@/components/auth/Loader";

export default function ResetPasswordForm({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const otp = formData.get("otp");
    const password = formData.get("password");

    try {
      setLoading(true);

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error.message);
        return;
      }

      toast.success("Password reset successful");
      window.location.href = "/signin";
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
          type="text"
          name="otp"
          placeholder="Enter OTP"
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="New password"
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
          Reset Password
        </button>
      </form>
    </>
  );
}
