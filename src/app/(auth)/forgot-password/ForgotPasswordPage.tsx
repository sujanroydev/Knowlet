"use client";

import { useState } from "react";
import { toast } from "sonner";
import Loader from "@/components/auth/Loader";
import AuthCard from "@/components/auth/AuthCard";
import PasswordInput from "@/components/ui/PasswordInput";
import { sendPasswordResetOtp } from "@/actions/auth/password-reset";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const otp = formData.get("otp");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (!password) {
      toast.warning("");
    }

    if ((password as string).length < 6) {
      toast.warning("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Password not matched");
      return;
    }

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
      router.push("/signin");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestOtp() {
    try {
      setOtpLoading(true);

      await sendPasswordResetOtp(email);

      toast.success("OTP sent (if account exists)", {
        description: `Email: ${email}`,
      });
      setOtpSent(true);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setOtpLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100dvh-120px)] flex items-center justify-center bg-gray-100 p-4">
      <AuthCard title="Forgot Password">
        {loading && <Loader />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            required
          />

          <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:border-blue-500">
            <input
              type="text"
              name="otp"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="flex-1 px-4 py-3 outline-none disabled:bg-gray-100"
              required={!otpSent}
            />

            <button
              type="button"
              onClick={handleRequestOtp}
              disabled={otpLoading}
              className="border-l border-gray-300 px-4 text-sm font-medium text-blue-600 hover:bg-gray-50 disabled:opacity-50"
            >
              {otpLoading ? "Sending..." : otpSent ? "Resend" : "Send OTP"}
            </button>
          </div>

          <PasswordInput name="password" placeholder="Password" required />

          <PasswordInput
            name="confirmPassword"
            placeholder="Confirm Password"
            required
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
            Reset Password
          </button>
        </form>
      </AuthCard>
    </main>
  );
}
