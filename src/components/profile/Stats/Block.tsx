import React from "react";

export default function StatsBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted p-4 rounded-xl border border-border shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <h3 className="mb-3 text-sm text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}
