"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ReaderContextType = {
  resourceId: string | null;
  setResourceId: (resourceId: string | null) => void;

  liked: boolean;
  bookmarked: boolean;

  toggleLike: () => void;
  toggleBookmark: () => void;

  next: (nextPath: string) => void;
  prev: (prevPath: string) => void;

  parsePath: () => Promise<ParsedPath>;
};

const ReaderContext = createContext<ReaderContextType | null>(null);

export function ReaderProvider({ children }: { children: React.ReactNode }) {
  const [liked, setLiked] = useState(false);
  const [resourceId, setResourceId] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const { user } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!resourceId) return;

    const currentResourceId = resourceId;

    loadResStats();

    const timer = setTimeout(() => {
      addHistory(currentResourceId);
    }, 10000);

    return () => clearTimeout(timer);
  }, [resourceId]);

  async function addHistory(resourceId: string) {
    try {
      const res = await fetch("/api/history/view_history", {
        method: "POST",
        body: JSON.stringify({
          resource_id: resourceId,
        }),
      });

      const { error } = await res.json();

      if (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function loadResStats() {
    try {
      const res = await fetch("/api/resources/stats", {
        method: "POST",
        body: JSON.stringify({ resource_id: resourceId }),
      });
      const { data, error } = await res.json();
      if (error || !data) console.error("error", error);
      setLiked(data.liked);
      setBookmarked(data.bookmarked);
    } catch (error) {
      console.error("error", error);
    }
  }

  async function toggleLike() {
    if (!user) {
      toast.error("you are not signed in");
      return;
    }
    setLiked((prev) => !prev);
    try {
      const res = await fetch("/api/likes/toggle", {
        method: "POST",
        body: JSON.stringify({ resource_id: resourceId }),
      });
      const { data, error } = await res.json();
      if (error) console.error("error", error);
    } catch (error) {
      console.error("error", error);
    }
  }

  async function toggleBookmark() {
    if (!user) {
      toast.error("you are not signed in");
      return;
    }
    setBookmarked((prev) => !prev);
    try {
      const res = await fetch("/api/bookmarks/toggle", {
        method: "POST",
        body: JSON.stringify({ resource_id: resourceId }),
      });
      const { data, error } = await res.json();
      if (error) console.error("error", error);
    } catch (error) {
      console.error("error", error);
    }
  }

  function next(nextPath: string) {
    router.push(nextPath);
    console.log("nextPath", nextPath);
  }

  function prev(prevPath: string) {
    router.push(prevPath);
    console.log("prevPath", prevPath);
  }

  async function parsePath(): Promise<ParsedPath> {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split("/").filter(Boolean);

    const target = pathParts[pathParts.length - 1];

    let prevTarget = target
      .split("-")
      .map((part, index) => (index === 1 ? Number(part) - 1 : part))
      .join("-");
    let nextTarget = target
      .split("-")
      .map((part, index) => (index === 1 ? Number(part) + 1 : part))
      .join("-");

    let prevPath: string | null = currentPath.replace(target, prevTarget);
    let nextPath: string | null = currentPath.replace(target, nextTarget);

    const [resPrev, resNext] = await Promise.allSettled([
      prevPath ? fetch(prevPath) : Promise.resolve(null),
      nextPath ? fetch(nextPath) : Promise.resolve(null),
    ]);

    console.log("resPrev", resPrev);
    console.log("resNext", resNext);

    prevPath =
      resPrev.status === "fulfilled" && resPrev.value?.ok ? prevPath : null;
    nextPath =
      resNext.status === "fulfilled" && resNext.value?.ok ? nextPath : null;
    return { currentPath, prevPath, nextPath, target, prevTarget, nextTarget };
  }

  return (
    <ReaderContext.Provider
      value={{
        resourceId,
        setResourceId,
        liked,
        bookmarked,
        toggleLike,
        toggleBookmark,
        next,
        prev,
        parsePath,
      }}
    >
      {children}
    </ReaderContext.Provider>
  );
}

export function useReader() {
  const ctx = useContext(ReaderContext);

  if (!ctx) {
    throw new Error("useReader must be used inside ReaderProvider");
  }

  return ctx;
}
