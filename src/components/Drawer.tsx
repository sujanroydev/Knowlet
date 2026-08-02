"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageSquarePlus,
  History,
  BookOpen,
  FilePlus2,
  Sparkles,
  Settings,
  UserRound,
  X,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { useDrawer } from "@/context/DrawerContext";
import { useKnowva } from "@/context/KnowvaContext";

import { fetchMessages } from "@/components/nexus/actions";

export default function Drawer() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const { open, setOpen } = useDrawer();
  const {
    chats,
    setChats,
    setMessages,
    setChatId,
    setParentId,
  } = useKnowva()

  const loadMessages = async (chatId: string) => {
    const fetchedMessages = await fetchMessages(chatId);
    setMessages(fetchedMessages || []);
    setChatId(chatId);
    setParentId((fetchedMessages || [])[(fetchedMessages || []).length - 1].id || "");
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-55 bg-black/40 transition-opacity duration-300 lg:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 z-60 flex h-full w-72 flex-col border-r border-border/50 bg-white/90 backdrop-blur-xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
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
            onClick={() => setOpen(false)}
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
        <main className="flex-1 overflow-hidden px-3">
          <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Recent Chats
          </p>

          <div className="h-full overflow-y-auto pb-4">
            {chats.map((c) => (
              <div
                key={c.id}
                className="relative mb-1"
              >
                <button
                  onClick={() => loadMessages(c.id)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 pr-10 text-sm transition hover:bg-accent hover:text-accent-foreground"
                >
                  <History
                    size={16}
                    className="shrink-0 text-muted-foreground"
                  />
                  <span className="truncate">{c.title}</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu(openMenu === c.id ? null : c.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-accent"
                >
                  <MoreHorizontal size={16} />
                </button>

                {openMenu === c.id && (
                  <div className="absolute right-2 top-full z-50 mt-1 w-40 overflow-hidden rounded-lg border bg-white shadow-lg">
                    <button
                      onClick={() => {
                        setOpenMenu(null);
                        // TODO: open rename dialog
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                    >
                      <Pencil size={16} />
                      Rename
                    </button>

                    <button
                      onClick={() => {
                        setOpenMenu(null);
                        // TODO: delete chat
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>

        {/* Navigation */}
        <nav className="border-t border-border/50 p-3">
          <Link
            href="/library"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-accent"
          >
            <BookOpen size={18} />
            <span>Library</span>
          </Link>

          <Link
            href="/dashboard/resource/create"
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-accent"
          >
            <FilePlus2 size={18} />
            <span>Create Resource</span>
          </Link>

          {/* <Link
              href="#"
              className="mt-1 flex w-full items-center gap-3 rounded-lg bg-gradient-to-r from-amber-500/15 to-yellow-500/10 px-3 py-2 text-sm font-medium text-amber-600 transition hover:from-amber-500/20 hover:to-yellow-500/20 dark:text-amber-400"
            >
            <Sparkles size={18} />
            <span>Upgrade to Pro</span>
          </Link> */}
        </nav>

        {/* Footer */}
        <footer className="border-t border-border/50 p-3">
          {/* <Link
            href="#"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-accent"
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link> */}

          <Link
            href="/profile"
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-accent"
          >
            <UserRound size={18} />
            <span>Profile</span>
          </Link>
        </footer>
      </aside>
    </>
  );
}