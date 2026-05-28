"use client";

import { useHeader } from "@/context/HeaderContext";
import { useReader } from "@/context/ReaderContext";
import { useEffect } from "react";
import ResourceFooterActions from "./resource-footer-actions";

export default function ReaderPageClient({
  children,
  resourceId,
}: {
  children: React.ReactNode;
  resourceId: string;
}) {
  const { setMode } = useHeader();
  const { setResourceId } = useReader();

  useEffect(() => {
    setMode("reader");
    setResourceId(resourceId);

    return () => {
      setMode("home");
    };
  }, []);

  return (
    <>
      {children}
      <ResourceFooterActions />
    </>
  )
}
