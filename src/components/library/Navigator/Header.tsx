"use client";

import Link from "next/link";

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
    <header className="space-y-2 border-b border-slate-200 p-4 bg-slate-50">
      <div className="flex flex-col items-center text-center gap-1 py-2">
        {title && (
          <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
        )}

        {subtitle && (
          <p className="text-sm text-slate-500 max-w-md">{subtitle}</p>
        )}
      </div>

      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-600">
            <li>
              <Link
                href="/library"
                className="text-slate-500 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
            </li>

            {breadcrumbs.map((segment, idx) => {
              const href =
                "/library/" + breadcrumbs.slice(0, idx + 1).join("/");

              const isLast = idx === breadcrumbs.length - 1;

              return (
                <li key={href} className="flex items-center gap-1">
                  <span className="text-slate-300">/</span>

                  {isLast ? (
                    <span className="text-slate-900 font-medium">
                      {segment}
                    </span>
                  ) : (
                    <Link
                      href={href}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {segment}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </header>
  );
}
