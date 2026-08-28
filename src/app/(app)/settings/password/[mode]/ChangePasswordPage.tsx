"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import AuthCard from "@/components/auth/AuthCard";
import PasswordInput from "@/components/ui/PasswordInput";
import { changeUserPassword } from "@/actions/user";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { user } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    try {
      e.preventDefault();

      if (!user?.email) throw new Error("Email not found");

      if (password.length < 6) {
        toast.warning("Password must be at least 6 characters");
        return;
      }

      if (password !== confirmPassword) {
        toast.warning("Passwords do not match");
        return;
      }

      if (oldPassword === password) {
        toast.warning("Cann't use old password");
        return;
      }

      setLoading(true);

      await changeUserPassword({ email: user?.email, password, oldPassword });

      toast.success("Password updated successfully.");

      setOldPassword("");
      setPassword("");
      setConfirmPassword("");

      router.back();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100dvh-120px)] flex items-center justify-center bg-gray-100 p-4">
      <AuthCard title="Change Password">
        <form onSubmit={handleSubmit} className="space-y-5">
          <PasswordInput
            name="oldPassword"
            placeholder="Old Password"
            onChange={(e) => setOldPassword(e.currentTarget.value)}
            value={oldPassword}
            required
          />

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
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Updating Password..." : "Change Password"}
          </button>
        </form>
      </AuthCard>
    </main>
  );
}
