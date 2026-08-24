import type { Metadata } from "next";
import KnowvaPage from "@/components/knowva/KnowvaPage";

export const metadata: Metadata = {
  title: "Knowva AI | Knowlet",

  icons: {
    icon: "/icons/knowva/favicon.ico",
  },

  description:
    "Ask questions, explore concepts, and get AI-powered academic assistance with Knowva AI on Knowlet.",

  alternates: {
    canonical: "https://knowlet.in/knowva",
  },

  openGraph: {
    title: "Knowva AI | Knowlet",
    description:
      "AI-powered learning assistant for notes, concepts, and academic help on Knowlet.",
    url: "https://knowlet.in/knowva",
    siteName: "Knowlet",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Knowva AI | Knowlet",
    description:
      "AI-powered learning assistant for notes, concepts, and academic help on Knowlet.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Knowva() {
  return (
    <div className="h-[calc(100dvh-120px)]">
      <KnowvaPage />
    </div>
  );
}
