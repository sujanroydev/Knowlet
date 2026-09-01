"use client";

import Link from "next/link";
import { ChevronRight, Library } from "lucide-react";

export default function Header({
  title,
  subtitle,
  path,
}: {
  title?: string;
  subtitle?: string;
  path?: string[];
}) {
  const breadcrumbs = path ?? [];

  return (
    <header className="border-b border-border bg-background px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link
                href="/library"
                className="inline-flex items-center gap-1.5 font-medium transition hover:text-primary"
              >
                <Library size={15} /> Library
              </Link>
            </li>
            {breadcrumbs.map((segment, idx) => {
              const href =
                "/library/" + breadcrumbs.slice(0, idx + 1).join("/");
              const isLast = idx === breadcrumbs.length - 1;
              const label = segment.replace(/-/g, " ");
              return (
                <li key={href} className="flex items-center gap-1.5">
                  <ChevronRight size={14} className="text-slate-300" />
                  {isLast ? (
                    <span className="font-medium capitalize text-foreground">
                      {label}
                    </span>
                  ) : (
                    <Link
                      href={href}
                      className="capitalize transition hover:text-primary"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        <div className="max-w-2xl">
          <p className="eyebrow mb-2">Library explorer</p>
          {title && (
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
