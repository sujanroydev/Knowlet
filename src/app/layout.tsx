import type { Metadata } from "next";
import "@/styles/resource-content.css";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";
import { AppProvider } from "@/context/AppContext";
import AppToaster from "@/components/AppToaster";
import SWRegister from "@/components/SWRegister";
import AdSense from "@/components/AdSense";

export const metadata: Metadata = {
  title: "Knowlet – Notes & Study Materials",
  description:
    "Free notes and study materials for college students. Download study materials for Mathematics, Physics, Computer Science, Statistics, Alternative English, Economics, Political Science, Education, Zoology, Botany, and more.",
  manifest: "/manifest.json",
  verification: {
    google: "MyH_ZXmYfE8D3u5iHa7tODNYysPhybxM7dWcc5i3nSI",
  },
  icons: {
    icon: "/icons/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <AdSense />
      </head>
      <body className="h-dvh py-15 box-border bg-gray-100">
        <AppProvider>
          <SWRegister />
          <div className="h-full flex flex-col">
            <TopBar />
            <div className="flex-1 overflow-y-auto">{children}</div>
            <AppToaster />
            <BottomNav />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
