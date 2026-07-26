"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement>;

export default function PasswordInput({
  className = "",
  ...props
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={show ? "text" : "password"}
        className={`w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-blue-500 ${className}`}
      />

      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="absolute inset-y-0 right-3 flex items-center"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}