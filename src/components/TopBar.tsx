"use client";

import { useAuth } from "@/context/AuthContext";
import { useHeader } from "@/context/HeaderContext";
import { usePathname, useRouter } from "next/navigation";
import ProfileMenu from "./profile/ProfileMenu";
import { useReader } from "@/context/ReaderContext";
import {
  ChevronLeft,
  Bookmark,
  ThumbsUp,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function TopBar() {
  const [parsedPath, setParsedPath] = useState<ParsedPath | null>(null);

  const { mode } = useHeader();
  const { user } = useAuth();
  const {
    liked,
    bookmarked,
    toggleLike,
    toggleBookmark,
    next,
    prev,
    parsePath,
  } = useReader();

  const router = useRouter();
  const pathname = usePathname();

  const Btn = ({ children, ...props }: Props) => (
    <button
      {...props}
      className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition
      hover:bg-slate-100 hover:text-indigo-600
      active:scale-95"
    >
      {children}
    </button>
  );

  async function updateParsedPath() {
    setParsedPath(await parsePath());
  }

  useEffect(() => {
    if (mode === "reader") {
      updateParsedPath();
    }
  }, [pathname]);

  return (
    <header className="fixed top-0 z-50 flex h-15 w-full items-center justify-center border-b bg-white/80 backdrop-blur-md px-4">
      {/* LEFT */}
      <div className="w-20">
        {pathname !== "/" && (
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* CENTER */}
      <div className="flex-1 flex items-center justify-center">
        {mode === "reader" && (
          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/70 px-2 py-1 shadow-sm backdrop-blur-md">
            <Btn
              onClick={() => prev(parsedPath?.prevPath!)}
              title={parsedPath?.prevTarget || ""}
              disabled={!parsedPath?.prevPath}
            >
              <SkipBack className="w-5 h-5" />
            </Btn>

            <Btn
              onClick={() => next(parsedPath?.nextPath!)}
              title={parsedPath?.nextTarget || ""}
              disabled={!parsedPath?.nextPath}
            >
              <SkipForward className="w-5 h-5" />
            </Btn>

            <Btn onClick={toggleLike} title={liked ? "Unlike" : "Like"}>
              <ThumbsUp
                className={`w-5 h-5 transition ${
                  liked ? "text-indigo-600 fill-indigo-100" : "text-slate-500"
                }`}
              />
            </Btn>

            <Btn
              onClick={toggleBookmark}
              title={bookmarked ? "Remove Bookmark" : "Bookmark"}
            >
              <Bookmark
                className={`w-5 h-5 transition ${
                  bookmarked
                    ? "text-indigo-600 fill-indigo-100"
                    : "text-slate-500"
                }`}
              />
            </Btn>
          </div>
        )}

        {mode === "home" && (
          <h1 className="text-lg font-semibold tracking-tight text-slate-800">
            Knowlet
          </h1>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex w-20 justify-end">
        {user ? (
          <ProfileMenu />
        ) : (
          <button
            onClick={() => router.push("/signin")}
            className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700 active:scale-95"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
