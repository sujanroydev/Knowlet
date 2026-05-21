import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "sonner";
import AppToaster from "@/components/AppToaster";
import SWRegister from "@/components/SWRegister";

export const metadata: Metadata = {
  title: "Knowlet – Notes & Study Materials",
  description:
    "Free notes and study materials for college students. Download study materials for Mathematics, Physics, Computer Science, Statistics, Alternative English, Economics, Political Science, Education, Zoology, Botany, and more.",

  verification: {
    google: "MyH_ZXmYfE8D3u5iHa7tODNYysPhybxM7dWcc5i3nSI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-dvh py-15 box-border overflow-hidden bg-gray-100">
        <AppProvider>
          <SWRegister />
          <div className="h-full flex flex-col">
            <TopBar /> {/* 60px */}
            <div className="flex-1 overflow-y-auto">
              <div className="min-h-[calc(100dvh-120px)] w-full max-w-3xl mx-auto">
                {children}
              </div>
            </div>
            <AppToaster />
            <BottomNav /> {/* 60px */}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
