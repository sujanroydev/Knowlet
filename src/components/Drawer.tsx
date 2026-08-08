"use client";

import { useEffect, useRef, useState } from "react";
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
  Pin,
  Archive
} from "lucide-react";

import { useDrawer } from "@/context/DrawerContext";
import { useKnowva } from "@/context/KnowvaContext";

import { useChatActions } from "@/hooks/knowva/useChatActions";

export default function Drawer() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { open, setOpen } = useDrawer();
  const { chats, chatId } = useKnowva();
  const {
    loadChat,
    deleteChatAction,
    createNewChat,
    pinChatAction,
    archiveChatAction,
  } = useChatActions();

  useEffect(() => {
    function handleOutsideClick(event: PointerEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

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
          <button
            onClick={() => createNewChat()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-600 transition hover:bg-blue-100 active:scale-95"
          >
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
            {chats
              .sort((a, b) => {
                if (a.pinned !== b.pinned) {
                  return a.pinned ? -1 : 1;
                }
                return (
                  new Date(b.last_message_at ?? b.created_at).getTime() -
                  new Date(a.last_message_at ?? a.created_at).getTime()
                );
              })
              .map((c) => (
              <div
                key={c.id}
                className="relative mb-1"
              >
                <button
                  onClick={() => loadChat(c.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 pr-10 text-sm transition ${
                    c.id === chatId
                      ? "bg-accent text-accent-foreground font-medium"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <History
                    size={16}
                    className={`shrink-0 ${
                      c.id === chatId
                        ? "text-accent-foreground"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span className="truncate">{c.title}</span>
                </button>

                <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                  {c.pinned && <Pin size={14} className="text-blue-600" />}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu(openMenu === c.id ? null : c.id);
                    }}
                    className="rounded p-1 hover:bg-accent"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                {openMenu === c.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-2 top-full z-50 mt-1 w-40 overflow-hidden rounded-lg border bg-white shadow-lg"
                  >
                    <button
                      onClick={() => {
                        setOpenMenu(null);
                        void pinChatAction(c.id, !c.pinned);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
                    >
                      <Pin size={16} />
                      {c.pinned ? "Unpin" : "Pin"}
                    </button>

                    {/* <button
                      onClick={() => {
                        setOpenMenu(null);
                        void archiveChatAction(c.id, true);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-amber-600 hover:bg-amber-50"
                    >
                      <Archive size={16} />
                      Archive
                    </button> */}

                    {/* <button
                      onClick={() => {
                        setOpenMenu(null);
                        // TODO: open rename dialog
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                    >
                      <Pencil size={16} />
                      Rename
                    </button> */}

                    <button
                      onClick={() => {
                        setOpenMenu(null);
                        void deleteChatAction(c.id);
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