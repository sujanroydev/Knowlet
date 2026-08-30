import { ReactNode } from "react";

export default function ListPageLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="page-shell min-h-full py-8 sm:py-12">
      <div className="surface-card mx-auto max-w-3xl p-5 sm:p-8">
        <p className="eyebrow mb-2 text-center">Your learning space</p>
        <h1 className="text-center text-3xl font-semibold tracking-[-0.04em] text-foreground">{title}</h1>
        <h2 className="mb-8 mt-2 text-center text-sm text-muted-foreground">
          {subtitle}
        </h2>

        {children}
      </div>
    </div>
  );
}
