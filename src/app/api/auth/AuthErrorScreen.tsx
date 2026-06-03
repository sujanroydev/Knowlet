import Link from "next/link";
import { ReactNode } from "react";

type Action = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
  icon?: ReactNode;
};

type Props = {
  code: string;
  title: string;
  message: string;
  icon: ReactNode;
  footer?: string;
  actions?: Action[];
};

export default function AuthErrorScreen({
  code,
  title,
  message,
  icon,
  footer,
  actions = [],
}: Props) {
  return (
    <div className="relative flex min-h-full items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-950 via-slate-900 to-black px-4">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-3xl" />

      {/* Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
            {icon}
            {code}
          </div>
        </div>

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-3xl bg-red-500/10 p-5 text-red-400 shadow-lg shadow-red-500/10">
            {icon}
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h1 className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-6xl font-black text-transparent">
            {code}
          </h1>

          <h2 className="mt-4 text-2xl font-bold text-white">{title}</h2>

          <p className="mt-3 text-sm leading-6 text-gray-400">{message}</p>
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {actions.map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3 font-medium transition hover:scale-[1.02] ${
                  action.variant === "primary"
                    ? "bg-white text-black"
                    : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {action.icon}
                {action.label}
              </Link>
            ))}
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div className="mt-8 border-t border-white/10 pt-5 text-center text-xs text-gray-500">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
