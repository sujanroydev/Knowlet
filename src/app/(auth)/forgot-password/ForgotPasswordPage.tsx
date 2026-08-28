"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import Loader from "@/components/auth/Loader";
import AuthCard from "@/components/auth/AuthCard";
import PasswordInput from "@/components/ui/PasswordInput";
import { useRouter } from "next/navigation";
import { resetUserPassword } from "@/actions/user";
import { sendAuthOtp } from "@/actions/auth/otp";
import { useAuth } from "@/context/AuthContext";
import maskEmail from "@/utils/maskEmail";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const router = useRouter();
  const { user } = useAuth();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const otp = formData.get("otp") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!email || !otp || !password) {
      toast.warning("All fields are required");
      return;
    }

    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Password not matched");
      return;
    }

    try {
      setLoading(true);

      await resetUserPassword({ email, otp, password });

      toast.success("Password reset successful");

      if (!user?.email) router.push("/signin");
      if (user?.email) router.back();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestOtp() {
    try {
      setOtpLoading(true);

      await sendAuthOtp({ email, type: "forgot_password" });

      toast.success("OTP sent to your email", {
        description: maskEmail(email),
      });
      setOtpSent(true);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setOtpLoading(false);
    }
  }

  useEffect(() => {
    if (!user?.email) return;
    setEmail(user.email);
  }, [user]);

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
            disabled={!!user?.email}
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
