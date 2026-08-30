import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function AuthCard({ title, children }: Props) {
  return (
    <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-[0_18px_60px_rgba(23,32,51,0.10)] sm:p-8">
      <p className="eyebrow mb-2 text-center">Welcome to Knowlet</p>
      <h1 className="mb-6 text-center text-3xl font-semibold tracking-[-0.04em] text-foreground">
        {title}
      </h1>

      {children}
    </div>
  );
}
