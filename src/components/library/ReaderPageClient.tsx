"use client";

import { useHeader } from "@/context/HeaderContext";
import { useEffect } from "react";

export default function ReaderPageClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setMode } = useHeader();

  useEffect(() => {
    setMode("reader");

    return () => {
      setMode("home");
    };
  }, []);

  return children;
}
