"use client";

import { Moon, Sun, Computer } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

function ThemeToggleContent() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const themes: Array<{
    value: "light" | "dark" | "system";
    label: string;
    icon: React.ReactNode;
  }> = [
    { value: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
    { value: "dark", label: "Dark", icon: <Moon className="w-4 h-4" /> },
    {
      value: "system",
      label: "System",
      icon: <Computer className="w-4 h-4" />,
    },
  ];

  const currentTheme = themes.find((t) => t.value === theme);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-accent hover:text-primary active:scale-95"
        title="Theme"
        aria-label="Toggle theme"
      >
        {currentTheme?.icon}
      </button>

      {open && (
        <>
          <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card shadow-lg z-50">
            <div className="p-2">
              <div className="mb-2 px-2 py-1 text-xs font-semibold uppercase text-muted-foreground">
                Theme
              </div>
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => {
                    setTheme(t.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    theme === t.value
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Close menu when clicking outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        </>
      )}
    </div>
  );
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  try {
    return <ThemeToggleContent />;
  } catch {
    // Fallback if theme context is not available
    return <div className="h-9 w-9" />;
  }
}
