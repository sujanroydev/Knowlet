"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

type ReaderContextType = {
  resourceId: string | null;
  setResourceId: (resourceId: string | null) => void;

  liked: boolean;
  bookmarked: boolean;

  toggleLike: () => void;
  toggleBookmark: () => void;

  next: () => void;
  prev: () => void;
};

const ReaderContext = createContext<ReaderContextType | null>(null);

export function ReaderProvider({ children }: { children: React.ReactNode }) {
  const [liked, setLiked] = useState(false);
  const [resourceId, setResourceId] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const { user } = useAuth();

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

  function next() {
    const { currentPath, nextPath } = parsePath();
    console.log("currentPath", currentPath);
    console.log("nextPath", nextPath);
  }

  function prev() {
    const { currentPath, prevPath } = parsePath();
    console.log("currentPath", currentPath);
    console.log("prevPath", prevPath);
  }
  
  function parsePath(): { currentPath: string; prevPath: string | null; nextPath: string | null, target: string } {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split("/").filter(Boolean);

    const target = pathParts[pathParts.length - 1];
    const prevPath = currentPath.replace(target, target.split("-").map((part, index) => index === 1 ? Number(part) - 1 : part).join("-"));
    const nextPath = currentPath.replace(target, target.split("-").map((part, index) => index === 1 ? Number(part) + 1 : part).join("-"));

    return { currentPath, prevPath, nextPath, target };
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
