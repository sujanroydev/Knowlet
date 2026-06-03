"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SearchPage() {
  const [resources, setResources] = useState<Resource[]>();
  const [searchResult, setSearchResult] = useState<Resource[]>();

  const [loading, setLoading] = useState(false);

  const [searchStr, setSearchStr] = useState("");

  const router = useRouter();

  async function fetchResource() {
    const res = await fetch("/api/resources");
    const { data, error } = await res.json();

    if (error) toast.error(error.message);
    console.log(data);
    setResources(data);
    setSearchResult(data);
  }

  useEffect(() => {
    fetchResource();
  }, []);

  return (
    <div className="w-full h-full m-auto max-w-3xl">
      <h1 className="font-semibold text-blue-800 text-3xl text-center">
        Search Any Resources
      </h1>
      <input
        value={searchStr}
        onChange={(e) => setSearchStr(e.target.value)}
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
            </div>
          ))}
      </div>
    </div>
  );
}
