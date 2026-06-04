"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SearchPage() {
  const [resources, setResources] = useState<Resource[]>();
  const [searchResult, setSearchResult] = useState<Resource[]>();

  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");

  const router = useRouter();

  async function fetchResource() {
    const res = await fetch("/api/resources");
    const { data, error } = await res.json();

    if (error) toast.error(error.message);

    setResources(data);
  }

  function getScore(resource: Resource, query: string) {
    let score = 0;

    const searchable = [
      resource.title,
      resource.description,
      ...[resource.path.replace(/(\/|\-)/g, " ")],
    ]
      .join(" ")
      .toLowerCase();

    for (const word of query.split(/\s+/)) {
      if (resource.title.toLowerCase().includes(word)) {
        score += 100;
      }

      if (searchable.includes(word)) {
        score += 20;
      }
    }

    return score;
  }

  useEffect(() => {
    fetchResource();
  }, []);

  useEffect(() => {
    setSearchResult(
      resources
        ?.map((resource) => ({
          resource,
          score: getScore(resource, query),
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.resource),
    );
  }, [query]);

  return (
    <div className="w-full h-full m-auto max-w-3xl">
      <h1 className="font-semibold text-blue-800 text-3xl text-center">
        Search Any Resources
      </h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value.toLowerCase())}
        className="w-full h-15 border rounded-full my-5"
        placeholder="Find Resource eg. Semester 1 Ecology Unit 2"
      />
      <div>
        {searchResult &&
          searchResult.map((resource, index) => (
            <div
              className="m-5 p-3 bg-white rounded-2xl shadow hover:bg-blue-400"
              key={index}
              onClick={() => router.push(`/library/${resource.path}`)}
            >
              <h2 className="text-center font-semibold text-lg">
                {resource.title}
              </h2>
              <p>{resource.description}</p>
              <div className="m-2 flex flex-row gap-1">
                {resource.path.split("/").map((i) => (
                  <span className="font-bold bg-purple-300 rounded-lg p-1">
                    {i.replace("-", " ")}
                  </span>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
