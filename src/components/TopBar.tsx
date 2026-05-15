"use client";

import { useAuth } from "@/context/AuthContext";
import { useHeader } from "@/context/HeaderContext";
import { usePathname, useRouter } from "next/navigation";
import ProfileMenu from "./profile/ProfileMenu";

export default function TopBar() {
  const { mode } = useHeader();
  const { user } = useAuth();

  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-50 flex h-15 w-full items-center justify-center border-b bg-white px-4">
      {/* LEFT */}
      <div className="w-20">
        {pathname !== "/" && (
          <button onClick={() => router.back()}>
            <img src="/icons/back.svg" alt="Back" />
          </button>
        )}
      </div>

      {/* CENTER */}
      <div className="flex-1 flex items-center justify-center">
        {mode === "reader" && (
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm">
            <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 active:scale-95">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path
                  d="M18 17L13 12L18 7M11 17L6 12L11 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 active:scale-95">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path
                  d="M6 17L11 12L6 7M13 17L18 12L13 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 active:scale-95">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path
                  d="M7 22V11M2 13V20C2 21.1046 2.89543 22 4 22H17.4262C18.907 22 20.1662 20.9197 20.3914 19.4562L21.4683 12.4562C21.7479 10.6389 20.3418 9 18.5032 9H15C14.4477 9 14 8.55228 14 8V4.46584C14 3.10399 12.896 2 11.5342 2C11.2093 2 10.915 2.1913 10.7831 2.48812L7.26394 10.4061C7.10344 10.7673 6.74532 11 6.35013 11H4C2.89543 11 2 11.8954 2 13Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 active:scale-95">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path
                  d="M5 7.8C5 6.11984 5 5.27976 5.32698 4.63803C5.6146 4.07354 6.07354 3.6146 6.63803 3.32698C7.27976 3 8.11984 3 9.8 3H14.2C15.8802 3 16.7202 3 17.362 3.32698C17.9265 3.6146 18.3854 4.07354 18.673 4.63803C19 5.27976 19 6.11984 19 7.8V21L12 17L5 21V7.8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}

        {mode === "home" && <h1>Knowlet</h1>}
      </div>

      {/* RIGHT */}
      <div className="flex w-20 justify-end">
        {user ? (
          <ProfileMenu />
        ) : (
          <button
            onClick={() => router.push("/signin")}
            className="font-semibold text-indigo-600"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
