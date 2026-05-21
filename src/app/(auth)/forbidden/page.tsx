import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="relative flex min-h-full items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-950 via-slate-900 to-black px-4">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-3xl" />

      {/* Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        {/* Top Badge */}
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
            <Lock size={16} />
            Restricted Access
          </div>
        </div>

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-3xl bg-red-500/10 p-5 text-red-400 shadow-lg shadow-red-500/10">
            <ShieldAlert size={60} strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h1 className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-6xl font-black text-transparent">
            403
          </h1>

          <h2 className="mt-4 text-2xl font-bold text-white">Access Denied</h2>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            You are signed in, but your account does not have permission to
            access this admin page.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:scale-[1.02]"
          >
            <ArrowLeft size={18} />
            Go Home
          </Link>

          <Link
            href="/help"
            className="flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
          >
            Contact Support
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-white/10 pt-5 text-center text-xs text-gray-500">
          Knowlet Admin Security Layer
        </div>
      </div>
    </div>
  );
}
