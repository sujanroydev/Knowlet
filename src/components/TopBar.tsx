"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  ChevronLeft,
  Bookmark,
  ThumbsUp,
  SkipBack,
  SkipForward,
  Edit,
  Download,
  Share2,
  Menu,
  SquarePen
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useHeader } from "@/context/HeaderContext";
import ProfileMenu from "./profile/ProfileMenu";
import { useReader } from "@/context/ReaderContext";
import { useKnowva } from "@/context/KnowvaContext";
import { useDrawer } from "@/context/DrawerContext";
import { ParsedPath } from "@/types/resource";
import { useChatActions } from "@/hooks/knowva/useChatActions";
import { ModelSelector } from "@/components/nexus/ModelSelector";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function TopBar() {
  const [parsedPath, setParsedPath] = useState<ParsedPath | null>(null);
  const [downloading, setDownloading] = useState(false);

  const { mode } = useHeader();
  const { user } = useAuth();
  const {
    liked,
    bookmarked,
    toggleLike,
    toggleBookmark,
    parsePath,
    resourceId,
  } = useReader();
  const { model, setModel } = useKnowva();
  const { setOpen: setOpenDrawer } = useDrawer();
  const { createNewChat } = useChatActions();

  const router = useRouter();
  const pathname = usePathname();

  const Btn = ({ children, ...props }: Props) => (
    <button
      {...props}
      className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition
      hover:bg-slate-100 hover:text-indigo-600
      active:scale-95"
    >
      {children}
    </button>
  );

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ url: pathname });
      } else {
        await navigator.clipboard.writeText(pathname);
        toast.info("Link copied to clipboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      toast.info("Generating PDF");

      const response = await fetch(`/api/resources/pdf/${resourceId}`);

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  async function updateParsedPath() {
    setParsedPath(await parsePath());
  }

  useEffect(() => {
    if (mode === "reader") {
      updateParsedPath();
    }
  }, [mode, pathname]);

  return (
    <header className="fixed top-0 z-50 flex h-15 w-full items-center justify-center border-b bg-white/80 backdrop-blur-md px-4">
      {/* LEFT */}
      <div className="w-20">
        {mode === "knowva" ? (
          <Btn
            title="Menu"
            onClick={() => setOpenDrawer(true)}
          >
            <Menu className="w-5 h-5" />
          </Btn>
        ) : (
          pathname !== "/" && (
            <button
              onClick={() => router.back()}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )
        )}
      </div>

      {/* CENTER */}
      <div className="flex-1 flex items-center justify-center">
        {mode === "reader" && (
          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/70 px-2 py-1 shadow-sm backdrop-blur-md">
            <Btn
              onClick={() =>
                parsedPath?.prevPath && router.push(parsedPath.prevPath)
              }
              title={parsedPath?.prevTarget || "none"}
              disabled={!parsedPath?.prevPath}
            >
              <SkipBack className="w-5 h-5" />
            </Btn>

            <Btn
              onClick={() =>
                parsedPath?.nextPath && router.push(parsedPath.nextPath)
              }
              title={parsedPath?.nextTarget || "none"}
              disabled={!parsedPath?.nextPath}
            >
              <SkipForward className="w-5 h-5" />
            </Btn>

            {user?.role === "admin" && resourceId && (
              <Btn
                onClick={() => {
                  router.push(`/dashboard/resources/update/${resourceId}`);
                }}
                title="update"
              >
                <Edit className="w-5 h-5" />
              </Btn>
            )}

            {user && user.email && resourceId && (
              <Btn
                onClick={handleDownload}
                title={downloading ? "Downloading..." : "Download PDF"}
                disabled={downloading}
              >
                <Download className="w-5 h-5" />
              </Btn>
            )}

            <Btn onClick={handleShare} title={"Share"}>
              <Share2 className={`w-5 h-5 transition`} />
            </Btn>

            <Btn onClick={toggleLike} title={liked ? "Unlike" : "Like"}>
              <ThumbsUp
                className={`w-5 h-5 transition ${
                  liked ? "text-indigo-600 fill-indigo-100" : "text-slate-500"
                }`}
              />
            </Btn>

            <Btn
              onClick={toggleBookmark}
              title={bookmarked ? "Remove Bookmark" : "Bookmark"}
            >
              <Bookmark
                className={`w-5 h-5 transition ${
                  bookmarked
                    ? "text-indigo-600 fill-indigo-100"
                    : "text-slate-500"
                }`}
              />
            </Btn>
          </div>
        )}

        {mode === "knowva" && (
          <div className="flex w-full items-center">
            <div className="flex flex-1 justify-start">
              <ModelSelector model={model} setModel={setModel} />
            </div>

            <div className="flex flex-1 justify-center">
              <h1 className="text-lg font-semibold tracking-tight text-slate-800">
                Knowva
              </h1>
            </div>

            <div className="flex flex-1 justify-end">
              <button
                onClick={() => createNewChat()}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium"
              >
                <SquarePen className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {mode === "home" && (
          <h1 className="text-lg font-semibold tracking-tight text-slate-800">
            Knowlet
          </h1>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex w-20 justify-end">
        {user ? (
          <ProfileMenu />
        ) : (
          <button
            onClick={() => router.push("/signin")}
            className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700 active:scale-95"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
