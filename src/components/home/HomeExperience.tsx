"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  Download as DownloadIcon,
  FileQuestion,
  FileText,
  FolderOpen,
  GraduationCap,
  Search,
  Smartphone,
  Sparkles,
  WifiOff,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { getHistory } from "@/actions/user/history";
import type { History } from "@/types/resource";

const subjects = [
  { name: "Mathematics", detail: "Notes, problems & formulas", icon: FileText },
  {
    name: "Computer Science",
    detail: "Concepts & practical guides",
    icon: FolderOpen,
  },
  { name: "Physics", detail: "Theory, numericals & PYQs", icon: Sparkles },
  { name: "Economics", detail: "Clear, structured resources", icon: BookOpen },
];

const resourceTypes = [
  {
    title: "Study notes",
    description: "Build clarity unit by unit.",
    icon: BookOpen,
  },
  {
    title: "Previous year questions",
    description: "Practice with real exam patterns.",
    icon: FileQuestion,
  },
  {
    title: "Important questions",
    description: "Focus on what matters most.",
    icon: Sparkles,
  },
  {
    title: "PDF resources",
    description: "Keep material ready offline.",
    icon: FileText,
  },
];

function ContinueStudying() {
  const { user } = useAuth();
  const [history, setHistory] = useState<History[]>([]);

  useEffect(() => {
    if (!user) return;

    getHistory(2)
      .then((items) => setHistory(items || []))
      .catch(() => setHistory([]));
  }, [user]);

  if (!user) {
    return (
      <div className="surface-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Make your library personal
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to save resources and pick up exactly where you left off.
          </p>
        </div>
        <Link href="/signin" className="button-secondary shrink-0">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="surface-card overflow-hidden">
      {history.length ? (
        <div className="divide-y divide-border">
          {history.map((item) => (
            <Link
              key={item.id}
              href={`/library/${item.resource.path}`}
              className="group flex items-center gap-4 p-5 transition hover:bg-muted"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                <Clock3 size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-foreground">
                  {item.resource.title}
                </p>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {item.resource.description || "Resume studying"}
                </p>
              </div>
              <ArrowRight
                className="shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary"
                size={18}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-5 text-sm text-muted-foreground">
          Your recently opened resources will appear here.
        </div>
      )}
    </div>
  );
}

export default function HomeExperience({
  library,
}: {
  library: React.ReactNode;
}) {
  const [installed, setInstalled] = useState(false);
  const [installSupported, setInstallSupported] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const isInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    setInstalled(isInstalled);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setInstallSupported(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <div className="overflow-hidden">
      <section className="page-shell py-8 sm:py-12 lg:py-16">
        <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-card px-5 py-10 shadow-[0_16px_50px_rgba(79,70,229,0.10)] sm:px-10 sm:py-14 lg:px-16">
          <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-indigo-100/70" />
          <div className="absolute bottom-0 left-1/2 h-36 w-36 rounded-full bg-violet-100/60" />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-4">Your everyday study space</p>
            <h1 className="text-4xl font-semibold tracking-[-0.055em] text-foreground sm:text-5xl lg:text-6xl">
              Find the material. Make the progress.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Free, organized notes and exam resources designed to make every
              study session feel more focused.
            </p>
            <Link
              href="/search"
              className="group mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-2xl border border-border bg-background p-2 pl-4 text-left shadow-sm transition hover:border-indigo-200 hover:shadow-md"
            >
              <Search className="shrink-0 text-primary" size={21} />
              <span className="flex-1 text-sm text-muted-foreground sm:text-base">
                Search subjects, papers, units, and resources
              </span>
              <span className="button-primary min-h-10 px-4">
                Search <ArrowRight size={16} className="hidden sm:block" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="page-shell pb-12 sm:pb-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Start exploring</p>
            <h2 className="section-heading">Popular subjects</h2>
          </div>
          <Link
            href="/library"
            className="hidden text-sm font-semibold text-primary hover:text-indigo-700 sm:inline-flex sm:items-center sm:gap-1"
          >
            View library <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {subjects.map(({ name, detail, icon: Icon }) => (
            <Link
              key={name}
              href="/library"
              className="surface-card group p-5 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                <Icon size={20} />
              </div>
              <h3 className="mt-6 font-semibold text-foreground">{name}</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {detail}
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Explore{" "}
                <ArrowRight
                  size={15}
                  className="transition group-hover:translate-x-1"
                />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-shell pb-12 sm:pb-16">
        <div className="mb-6">
          <p className="eyebrow mb-2">Keep your momentum</p>
          <h2 className="section-heading">Continue studying</h2>
        </div>
        <ContinueStudying />
      </section>

      <section className="border-y border-border py-12 sm:py-16">
        <div className="page-shell">
          <div className="mb-7 max-w-2xl">
            <p className="eyebrow mb-2">Everything in one place</p>
            <h2 className="section-heading">Explore resources your way</h2>
            <p className="mt-3 text-muted-foreground">
              Choose a resource type, then navigate through your course material
              with a clear path.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {resourceTypes.map(({ title, description, icon: Icon }) => (
              <Link
                key={title}
                href="/library"
                className="group rounded-2xl border border-border bg-background p-5 transition hover:boder hover:bg-muted hover:shadow-sm"
              >
                <Icon className="text-primary" size={21} />
                <h3 className="mt-5 font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-12 sm:py-16">
        <div className="mb-7 text-center">
          <p className="eyebrow mb-2">The Knowlet library</p>
          <h2 className="section-heading">Browse by semester and subject</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            A structured library that helps you reach the right unit without
            digging through clutter.
          </p>
        </div>
        <div className="surface-card overflow-hidden">{library}</div>
      </section>

      {!installed && installSupported && (
        <section className="border-y border-border py-12 sm:py-16">
          <div className="page-shell">
            <div className="mx-auto grid max-w-5xl gap-8 rounded-3xl border border-border bg-background p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
                  <Smartphone size={22} />
                </div>
                <p className="eyebrow mt-6">Study on your schedule</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                  Keep Knowlet one tap away
                </h2>
                <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
                  Install Knowlet for a focused, app-like study space. Get back
                  to your library quickly, save time between classes, and keep
                  useful resources close whenever you need them.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-foreground">
                  {[
                    "Open your study material directly from your device.",
                    "Use the same bookmarks, history, and Knowva assistant.",
                    "Download resources for offline revision when supported.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-primary">
                        <Check size={13} strokeWidth={3} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <WifiOff size={17} className="text-primary" /> Ready when
                    you are
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    "Install Knowlet in your browser for the fastest
                    experience."
                  </p>
                </div>
                <button
                  onClick={installApp}
                  className="button-primary mt-8 w-full"
                >
                  <DownloadIcon size={17} /> Install Knowlet
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="page-shell pb-12 sm:pb-16">
        <div className="rounded-3xl bg-slate-950 px-6 py-10 text-center text-white sm:px-10">
          <GraduationCap className="mx-auto text-indigo-300" size={30} />
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">
            Study smarter, one resource at a time.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">
            Save useful material, revisit it when you need it, and keep your
            learning moving.
          </p>
          <Link
            href="/library"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-indigo-50"
          >
            Open the library <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
