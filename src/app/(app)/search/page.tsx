"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export default function SearchPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  async function fetchResources() {
    try {
      setLoading(true);

      const res = await fetch("/api/resources");
      const { data, error } = await res.json();

      if (error) {
        toast.error(error.message);
        return;
      }

      setResources(data || []);
    } catch {
      toast.error("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  }

  function getScore(resource: Resource, query: string) {
    if (!query.trim()) return 0;

    let score = 0;

    const title = resource.title.toLowerCase();
    const path = resource.path.replace(/(\/|\-)/g, " ");
    const description = resource.description ?? "";

    const words = query.toLowerCase().split(/\s+/).filter(Boolean);

    for (const word of words) {
      if (path.startsWith(word)) {
        score += 1500;
      } else if (path.includes(word)) {
        score += 1000;
      }

      if (title === word) {
        score += 1000;
      } else if (title.startsWith(word)) {
        score += 500;
      } else if (title.includes(word)) {
        score += 200;
      }

      if (description.includes(word)) {
        score += 100;
      }
    }

    return score;
  }

  useEffect(() => {
    fetchResources();
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const searchResults = useMemo(() => {
    if (!debouncedQuery) return [];

    return resources
      .map((resource) => ({
        resource,
        score: getScore(resource, debouncedQuery),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.resource)
      .slice(0, 30);
  }, [resources, debouncedQuery]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-center text-3xl font-bold">Search Resources</h1>

      <p className="mb-6 text-center text-muted-foreground">
        Find notes, papers, units, subjects and study materials.
      </p>

      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search e.g. Semester 1 Ecology Unit 2"
        className="
          mb-8
          w-full
          rounded-2xl
          border
          bg-background
          px-5
          py-4
          text-lg
          shadow-sm
          outline-none
          transition
          focus:border-primary
          focus:ring-4
          focus:ring-primary/10
        "
      />

      {loading && (
        <div className="py-16 text-center text-muted-foreground">
          Loading resources...
        </div>
      )}

      {!loading && debouncedQuery && searchResults.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          No resources found for "{debouncedQuery}"
        </div>
      )}

      <div className="space-y-4">
        {searchResults.map((resource) => (
          <div
            key={resource.id}
            onClick={() => router.push(`/library/${resource.path}`)}
            className="
              cursor-pointer
              rounded-2xl
              border
              bg-card
              p-5
              shadow-sm
              transition-all
              hover:-translate-y-1
              hover:border-primary/40
              hover:shadow-lg
            "
          >
            <h2 className="text-xl font-semibold">{resource.title}</h2>

            {resource.description && (
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {resource.description}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {resource.path.split("/").map((part) => (
                <span
                  key={part}
                  className="
                    rounded-full
                    bg-primary/10
                    px-3
                    py-1
                    text-xs
                    font-medium
                    text-primary
                  "
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
