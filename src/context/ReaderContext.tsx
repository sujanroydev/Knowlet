"use client";

import { createContext, useContext, useState } from "react";

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

  async function toggleLike() {
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
    console.log("next");
  }

  function prev() {
    console.log("prev");
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
