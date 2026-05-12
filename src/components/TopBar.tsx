"use client";

import { useHeader } from "@/context/HeaderContext";

export default function TopBar() {
  const { title } = useHeader();
  return (
    <header className="h-15 w-full border-b bg-white flex justify-center items-center px-4 fixed top-0 z-50">
      <div className="font-semibold text-indigo-600">Knowlet</div>

      <div className="flex-1 text-center text-sm text-gray-600">{title}</div>

      <div className="flex items-center gap-3">
        <button className="text-gray-500 hover:text-indigo-600">🔍</button>
        <button className="text-gray-500 hover:text-indigo-600">⚙️</button>
      </div>
    </header>
  );
}
