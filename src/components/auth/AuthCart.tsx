import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function AuthCard({ title, children }: Props) {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
        {title}
      </h1>

      {children}
    </div>
  );
}
