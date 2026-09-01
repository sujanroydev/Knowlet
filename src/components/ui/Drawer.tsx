"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: "left" | "right";
  width?: string;
  showCloseButton?: boolean;
}

export default function Drawer({
  open,
  onClose,
  children,
  side = "left",
  width = "w-72",
  showCloseButton = true,
}: DrawerProps) {
  const isLeft = side === "left";

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-55 bg-black/40 transition-opacity duration-300 lg:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        aria-hidden={!open}
        className={`fixed top-0 z-60 flex h-full ${width} max-w-[90vw] flex-col bg-card/90 backdrop-blur-xl transition-transform duration-300 ease-out ${
          isLeft
            ? "left-0 border-r border-border/50"
            : "right-0 border-l border-border/50"
        } ${
          open
            ? "translate-x-0"
            : isLeft
              ? "-translate-x-full"
              : "translate-x-full"
        }`}
      >
        {showCloseButton && (
          <header className="flex items-center justify-end border-b border-border/50 p-5">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="rounded-lg p-2 transition hover:bg-accent"
            >
              <X size={18} />
            </button>
          </header>
        )}

        {children}
      </aside>
    </>
  );
}
