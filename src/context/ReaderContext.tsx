"use client";

import { createContext, useContext, useState } from "react";

type ReaderContextType = {
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

  const [bookmarked, setBookmarked] = useState(false);

  function toggleLike() {
    setLiked((prev) => !prev);
  }

  function toggleBookmark() {
    setBookmarked((prev) => !prev);
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
