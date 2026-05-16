"use client";

import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems: NavItem[] = [
    {
      href: "/",
      label: "Home",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
    },
    {
      href: "/bookmarks",
      label: "Bookmarks",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path
            d="M5 7.8C5 6.11984 5 5.27976 5.32698 4.63803C5.6146 4.07354 6.07354 3.6146 6.63803 3.32698C7.27976 3 8.11984 3 9.8 3H14.2C15.8802 3 16.7202 3 17.362 3.32698C17.9265 3.6146 18.3854 4.07354 18.673 4.63803C19 5.27976 19 6.11984 19 7.8V21L12 17L5 21V7.8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      href: "/nexus",
      label: "Nexus",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor" />
          <text
            x="50%"
            y="55%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fontFamily="Arial, sans-serif"
            fill="white"
            fontWeight="600"
          >
            AI
          </text>
        </svg>
      ),
    },
    {
      href: "/history",
      label: "History",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M13 3a9 9 0 0 0-9 9H1l4 4 4-4H6a7 7 0 1 1 7 7 c-1.93 0-3.68-.78-4.95-2.05l-1.42 1.42A8.96 8.96 0 1 0 13 3zm-1 5v5l4.25 2.52.75-1.23-3.5-2.04V8z" />
        </svg>
      ),
    },
    {
      href: "/profile",
      label: "Profile",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 12c2.7 0 4.88-2.18 4.88-4.88S14.7 2.25 12 2.25 7.12 4.43 7.12 7.12 9.3 12 12 12zm0 2.25 c-3.25 0-9.75 1.63-9.75 4.88V21h19.5v-1.87 c0-3.25-6.5-4.88-9.75-4.88z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full h-15 bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.1)] flex justify-around items-center z-50 pb-[env(safe-area-inset-bottom)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <div
            key={item.href}
            onClick={() => router.push(item.href)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors text-xs font-medium
              ${
                isActive
                  ? "text-indigo-600 font-bold"
                  : "text-gray-500 hover:text-indigo-600"
              }`}
          >
            <div
              className={`mb-0.5 transition-transform ${
                isActive ? "scale-110" : ""
              }`}
            >
              {item.icon}
            </div>

            <span>{item.label}</span>
          </div>
        );
      })}
    </nav>
  );
}
