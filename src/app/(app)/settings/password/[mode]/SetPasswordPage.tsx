"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import AuthCard from "@/components/auth/AuthCard";
import PasswordInput from "@/components/ui/PasswordInput";
import maskEmail from "@/utils/maskEmail";
import { setUserPassword } from "@/actions/user";
import { sendAuthOtp } from "@/actions/auth/otp";
import { useRouter } from "next/navigation";

export default function SetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const router = useRouter();
  const { user } = useAuth();
  const email = user?.email;

  async function handleRequestOtp() {
    if (!email) {
      toast.warning("Email is required");
      return;
    }

    try {
      setOtpLoading(true);

      await sendAuthOtp({ email, type: "set_password" });

      setOtpSent(true);

      toast.success("OTP sent to your email", {
        description: maskEmail(email),
      });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setOtpLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      if (!email) throw new Error("Email not found");

      await setUserPassword({ email, password, otp });

      toast.success("Password updated successfully.");

      setPassword("");
      setConfirmPassword("");
      setOtp("");

      router.back();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100dvh-120px)] flex items-center justify-center bg-background p-4">
      <AuthCard title="Reset Password">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex overflow-hidden rounded-lg border border-border focus-within:border-primary">
            <input
              type="text"
              name="otp"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="flex-1 px-4 py-3 outline-none disabled:bg-muted"
              disabled={!otpSent}
              required
            />

            <button
              type="button"
              onClick={handleRequestOtp}
              disabled={otpLoading}
              className="border-l border-border px-4 text-sm font-medium text-primary hover:bg-accent disabled:opacity-50"
            >
              {otpLoading ? "Sending..." : otpSent ? "Resend" : "Send OTP"}
            </button>
          </div>

          <PasswordInput
            name="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.currentTarget.value)}
            value={password}
            required
          />

          <PasswordInput
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
            value={confirmPassword}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Updating Password..." : "Set Password"}
          </button>
        </form>
      </AuthCard>
    </main>
  );
}
