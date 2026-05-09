"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-50 bg-white px-5 py-4 flex justify-between items-center shadow-md border-b border-gray-200">
      <div className="text-xl font-bold tracking-wide">Knowlet</div>

      <div className="flex gap-2">
        <button
          onClick={() => router.push("signin")}
          className="px-3 py-1 text-xs border rounded hover:bg-gray-100"
        >
          Sign In
        </button>
        <button
          onClick={() => router.push("signup")}
          className="px-3 py-1 text-xs border rounded hover:bg-gray-100"
        >
          Sign Up
        </button>
        <button className="px-3 py-1 text-xs border rounded hover:bg-gray-100 hidden">
          Sign Out
        </button>
      </div>
    </div>
  );
}
