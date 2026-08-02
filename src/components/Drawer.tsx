"use client";

import { useState } from "react";
import {
  MessageSquarePlus,
  History,
  BookOpen,
  FilePlus2,
  Sparkles,
  Settings,
  UserRound,
  X,
} from "lucide-react";
// import { useHeader } from "@/context/HeaderContext";

export default function Drawer() {
  // const { drawerOpen, setDrawerOpen } = useHeader();

  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-55 bg-black/40 transition-opacity duration-300 lg:hidden ${
          drawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 z-60 flex h-screen w-72 flex-col border-r border-border/50 bg-white/90 backdrop-blur-xl transition-transform duration-300 ease-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border/50 p-5">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Knowva</h1>
            <p className="text-xs text-muted-foreground">
              Your AI study companion
            </p>
          </div>

          <button
            onClick={() => setDrawerOpen(false)}
            className="rounded-lg p-2 transition hover:bg-accent"
          >
            <X size={18} />
          </button>
        </header>

        {/* New Chat */}
        <div className="p-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-95">
            <MessageSquarePlus size={18} />
            New Chat
          </button>
        </div>

        {/* Recent Chats */}
        <main className="flex-1 overflow-y-auto px-3">
          <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Recent Chats
          </p>

          {Array.from({ length: 6 }).map((_, i) => (
            <button
              key={i}
              className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-accent hover:text-accent-foreground"
            >
              <History
                size={16}
                className="shrink-0 text-muted-foreground"
              />
              <span className="truncate">Chat {i + 1}</span>
            </button>
          ))}
        </main>

        {/* Navigation */}
        <nav className="border-t border-border/50 p-3">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-accent">
            <BookOpen size={18} />
            <span>Library</span>
          </button>

          <button className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-accent">
            <FilePlus2 size={18} />
            <span>Create Resource</span>
          </button>

          <button className="mt-1 flex w-full items-center gap-3 rounded-lg bg-gradient-to-r from-amber-500/15 to-yellow-500/10 px-3 py-2 text-sm font-medium text-amber-600 transition hover:from-amber-500/20 hover:to-yellow-500/20 dark:text-amber-400">
            <Sparkles size={18} />
            <span>Upgrade to Pro</span>
          </button>
        </nav>

        {/* Footer */}
        <footer className="border-t border-border/50 p-3">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-accent">
            <Settings size={18} />
            <span>Settings</span>
          </button>

          <button className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-accent">
            <UserRound size={18} />
            <span>Profile</span>
          </button>
        </footer>
      </aside>

      {/* Demo open button (remove when using HeaderContext) */}
      {!drawerOpen && (
        <button
          onClick={() => setDrawerOpen(true)}
          className="fixed left-4 top-4 z-30 rounded-lg border bg-background p-2 shadow-lg lg:hidden"
        >
          <MessageSquarePlus size={20} />
        </button>
      )}
    </>
  );
}