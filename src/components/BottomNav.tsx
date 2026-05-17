"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Bookmark, Bot, History, User } from "lucide-react";

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
      icon: <Home className="w-6 h-6" />,
    },
    {
      href: "/bookmarks",
      label: "Bookmarks",
      icon: <Bookmark className="w-6 h-6" />,
    },
    {
      href: "/nexus",
      label: "Nexus",
      icon: <Bot className="w-6 h-6" />,
    },
    {
      href: "/history",
      label: "History",
      icon: <History className="w-6 h-6" />,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: <User className="w-6 h-6" />,
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
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors text-xs font-medium cursor-pointer
              ${
                isActive
                  ? "text-indigo-600 font-semibold"
                  : "text-gray-500 hover:text-indigo-600"
              }`}
          >
            <div
              className={`mb-0.5 transition-all duration-200 ${
                isActive ? "scale-110 -translate-y-1" : "scale-100"
              }`}
            >
              {item.icon}
            </div>

            <span
              className={`text-xs transition-all duration-200 ${
                isActive ? "opacity-100 translate-y-0" : "opacity-70"
              }`}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
}
