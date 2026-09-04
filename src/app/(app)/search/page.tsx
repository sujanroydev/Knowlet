"use client";

import { Resource } from "@/types/resource";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowUpRight, Search } from "lucide-react";

export default function SearchPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 1500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setSearchResults([]);
      return;
    }

    search();
  }, [debouncedQuery]);

  const search = async () => {
    try {
      if (query.length < 10) {
        toast.warning("Query must be at least 10 characters long");
        return;
      }

      setLoading(true);

      const res = await fetch(
        `/api/resources/search?query=${encodeURIComponent(debouncedQuery)}`,
      );

      const { data, error } = await res.json();

      if (error) {
        toast.error(error.message);
        return;
      }

      setSearchResults(data ?? []);
    } catch {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell py-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow mb-2 text-center">Knowlet library</p>
        <h1 className="mb-2 text-center text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          Search resources
        </h1>

        <p className="mb-6 text-center text-muted-foreground">
          Find notes, papers, units, subjects and study materials.
        </p>

        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
        >
          <input
            type="search"
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search e.g. Semester 1 Ecology Unit 2"
            className="mb-8 w-full rounded-2xl border border-border bg-card px-5 py-4 pl-12 text-base shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
          <Search
            className="pointer-events-none relative -top-[4.55rem] left-4 text-primary"
            size={20}
          />
        </form>

        {loading && (
          <div className="py-10 text-center text-muted-foreground">
            Searching...
          </div>
        )}

        {!loading && debouncedQuery && searchResults.length === 0 && (
          <div className="py-10 text-center text-muted-foreground">
            No resources found for "{debouncedQuery}"
          </div>
        )}

        <div className="space-y-4">
          {searchResults.map((resource) => (
            <div
              key={resource.id}
              onClick={() => router.push(`/library/${resource.path}`)}
              className="group cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold">{resource.title}</h2>

              {resource.description && (
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {resource.description}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {resource?.path &&
                  resource.path
                    .split("/")
                    .slice(1)
                    .map((part, index) => (
                      <span
                        key={`${part}-${index}`}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {part.replace(/-/g, " ")}
                      </span>
                    ))}
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Open resource{" "}
                <ArrowUpRight
                  size={15}
                  className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
