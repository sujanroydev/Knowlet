"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-center text-3xl font-bold">Search Resources</h1>

      <p className="mb-6 text-center text-muted-foreground">
        Find notes, papers, units, subjects and study materials.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search e.g. Semester 1 Ecology Unit 2"
          className="mb-8 w-full rounded-2xl border bg-background px-5 py-4 text-lg shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
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
            className="cursor-pointer rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">{resource.title}</h2>

            {resource.description && (
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {resource.description}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {resource.path.split("/").map((part, index) => (
                <span
                  key={`${part}-${index}`}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {part.replace(/-/g, " ")}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
