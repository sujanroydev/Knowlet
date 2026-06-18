import React from "react";

export default function StatsBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <h3 className="mb-3 text-sm text-gray-700">{title}</h3>
      {children}
    </div>
  );
}
