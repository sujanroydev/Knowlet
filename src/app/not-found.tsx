"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-b bg-background px-6">
      <div className="text-center max-w-md">
        {/* Floating icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-card text-muted-foreground shadow-sm animate-bounce">
          <Search size={28} />
        </div>

        <h1 className="text-7xl font-bold tracking-tight text-foreground">
          404
        </h1>

        <p className="mt-4 text-lg font-semibold text-muted-foreground">
          Page not found
        </p>

        <p className="mt-2 text-sm text-foreground">
          This page doesn’t exist or may have been moved.
        </p>

        {/* Quick actions */}
        <div className="mt-8 space-y-3">
          {/* Back */}
          <button
            onClick={() => window.history.back()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-muted active:scale-95"
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
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground transition hover:-translate-y-0.5 hover:bg-muted active:scale-95"
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
