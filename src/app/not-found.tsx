"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-b from-gray-50 to-white px-6">
      <div className="text-center max-w-md">
        {/* Floating icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm animate-bounce">
          <Search size={28} />
        </div>

        <h1 className="text-7xl font-bold tracking-tight text-slate-800">
          404
        </h1>

        <p className="mt-4 text-lg font-semibold text-slate-700">
          Page not found
        </p>

        <p className="mt-2 text-sm text-slate-500">
          This page doesn’t exist or may have been moved.
        </p>

        {/* Quick actions */}
        <div className="mt-8 space-y-3">
          {/* Back */}
          <button
            onClick={() => window.history.back()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-100 active:scale-95"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          {/* Home */}
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 active:scale-95"
          >
            <Home size={16} />
            Home
          </Link>

          {/* Library (more useful for your app) */}
          <Link
            href="/library"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-100 active:scale-95"
          >
            <BookOpen size={16} />
            Open Library
          </Link>
        </div>

        {/* subtle hint */}
        <p className="mt-6 text-xs text-slate-400">
          Tip: Check the URL or return to your study library
        </p>
      </div>
    </div>
  );
}
