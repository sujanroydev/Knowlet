"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  X,
  MessageSquarePlus,
  History,
  BookOpen,
  FilePlus2,
  UserRound,
  MoreHorizontal,
  Trash2,
  Pin,
} from "lucide-react";

import Drawer from "@/components/ui/Drawer";

import { useDrawer } from "@/context/DrawerContext";
import { useKnowva } from "@/context/KnowvaContext";

import { useChatActions } from "@/hooks/knowva/useChatActions";

export default function KnowvaDrawer() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { open, setOpen } = useDrawer();
  const { chats, chatId } = useKnowva();

  const {
    loadChat,
    deleteChatAction,
    createNewChat,
    pinChatAction,
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

  function handleNewChat() {
    createNewChat();
    setOpen(false);
  }

  function handleLoadChat(id: string) {
    loadChat(id);
    setOpen(false);
  }

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      side="left"
      width="w-72"
      showCloseButton={false}
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border/50 p-5">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Knowva
          </h1>

          <p className="text-xs text-muted-foreground">
            Your AI study companion
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close drawer"
          className="rounded-lg p-2 transition hover:bg-accent"
        >
          <X size={18} className="rotate-90" />
        </button>
      </header>

      {/* New Chat */}
      <div className="p-4">
        <button
          type="button"
          onClick={handleNewChat}
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
                new Date(
                  b.last_message_at ?? b.created_at,
                ).getTime() -
                new Date(
                  a.last_message_at ?? a.created_at,
                ).getTime()
              );
            })
            .map((c) => (
              <div
                key={c.id}
                className="relative mb-1"
              >
                {/* Chat */}
                <button
                  type="button"
                  onClick={() => handleLoadChat(c.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 pr-10 text-sm transition ${
                    c.id === chatId
                      ? "bg-accent font-medium text-accent-foreground"
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

                  <span className="truncate">
                    {c.title}
                  </span>
                </button>

                {/* Chat Actions */}
                <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                  {c.pinned && (
                    <Pin
                      size={14}
                      className="text-blue-600"
                    />
                  )}

                  <button
                    type="button"
                    aria-label="Chat actions"
                    onClick={(event) => {
                      event.stopPropagation();

                      setOpenMenu(
                        openMenu === c.id
                          ? null
                          : c.id,
                      );
                    }}
                    className="rounded p-1 hover:bg-accent"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                {/* Chat Menu */}
                {openMenu === c.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-2 top-full z-50 mt-1 w-40 overflow-hidden rounded-lg border bg-white shadow-lg"
                  >
                    {/* Pin */}
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenu(null);

                        void pinChatAction(
                          c.id,
                          !c.pinned,
                        );
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
                    >
                      <Pin size={16} />

                      {c.pinned
                        ? "Unpin"
                        : "Pin"}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenu(null);

                        void deleteChatAction(
                          c.id,
                        );
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
          onClick={() => setOpen(false)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-accent"
        >
          <BookOpen size={18} />
          <span>Library</span>
        </Link>

        <Link
          href="/dashboard/resource/create"
          onClick={() => setOpen(false)}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-accent"
        >
          <FilePlus2 size={18} />
          <span>Create Resource</span>
        </Link>
      </nav>

      {/* Footer */}
      <footer className="border-t border-border/50 p-3">
        <Link
          href="/profile"
          onClick={() => setOpen(false)}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-accent"
        >
          <UserRound size={18} />
          <span>Profile</span>
        </Link>
      </footer>
    </Drawer>
  );
}