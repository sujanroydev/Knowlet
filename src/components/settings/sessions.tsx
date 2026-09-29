"use client";

import { useEffect, useState } from "react";
import { Monitor, Smartphone, Tablet, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

type AuthSession = {
  id: string;
  user_agent: string | null;
  ip_address: string | null;
  created_at: string;
  last_used_at: string | null;
  expires_at: string;
  isCurrent: boolean;
};

function getDeviceInfo(userAgent: string | null) {
  if (!userAgent) {
    return {
      name: "Unknown device",
      browser: "Unknown browser",
      icon: Monitor,
    };
  }

  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);

  const isTablet = /iPad|Tablet/i.test(userAgent);

  let browser = "Unknown browser";

  if (/Edg\//i.test(userAgent)) {
    browser = "Microsoft Edge";
  } else if (/Chrome\//i.test(userAgent)) {
    browser = "Google Chrome";
  } else if (/Firefox\//i.test(userAgent)) {
    browser = "Mozilla Firefox";
  } else if (/Safari\//i.test(userAgent) && !/Chrome\//i.test(userAgent)) {
    browser = "Safari";
  }

  let os = "Unknown OS";

  if (/Windows NT/i.test(userAgent)) {
    os = "Windows";
  } else if (/Mac OS X/i.test(userAgent)) {
    os = "macOS";
  } else if (/Android/i.test(userAgent)) {
    os = "Android";
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    os = "iOS";
  } else if (/Linux/i.test(userAgent)) {
    os = "Linux";
  }

  const Icon = isTablet ? Tablet : isMobile ? Smartphone : Monitor;

  return {
    name: `${browser} on ${os}`,
    browser,
    icon: Icon,
  };
}

function formatLastActive(date: string | null) {
  if (!date) return "Never";

  const timestamp = new Date(date).getTime();
  const now = Date.now();

  const seconds = Math.floor((now - timestamp) / 1000);

  if (seconds < 60) {
    return "Active now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return new Date(date).toLocaleDateString();
}

export default function Sessions() {
  const [sessions, setSessions] = useState<AuthSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState<string | null>(null);
  const [signingOutAll, setSigningOutAll] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      const response = await fetch("/api/auth/sessions", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to load sessions");
      }

      const data = await response.json();

      setSessions(data.sessions ?? []);
    } catch {
      toast.error("Failed to load your devices");
    } finally {
      setLoading(false);
    }
  }

  async function signOutSession(sessionId: string) {
    const confirmed = window.confirm(
      "Sign out this device?\n\nYou will need to sign in again on this device.",
    );

    if (!confirmed) return;

    setSigningOut(sessionId);

    try {
      const response = await fetch(`/api/auth/sessions/${sessionId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to sign out");
      }

      setSessions((current) =>
        current.filter((session) => session.id !== sessionId),
      );

      toast.success("Device signed out");
    } catch {
      toast.error("Failed to sign out device");
    } finally {
      setSigningOut(null);
    }
  }

  async function signOutAllOtherSessions() {
    const confirmed = window.confirm(
      "Sign out all other devices?\n\nYour current device will remain signed in.",
    );

    if (!confirmed) return;

    setSigningOutAll(true);

    try {
      const response = await fetch("/api/auth/sessions", {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to sign out devices");
      }

      setSessions((current) => current.filter((session) => session.isCurrent));

      toast.success("All other devices have been signed out");
    } catch {
      toast.error("Failed to sign out other devices");
    } finally {
      setSigningOutAll(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  const otherSessions = sessions.filter((session) => !session.isCurrent);

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Devices & Sessions</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage the devices where you are signed in.
          </p>
        </div>

        {otherSessions.length > 0 && (
          <button
            type="button"
            onClick={signOutAllOtherSessions}
            disabled={signingOutAll}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50"
          >
            <LogOut className="size-4" />

            {signingOutAll ? "Signing out..." : "Sign out all other devices"}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {sessions.length === 0 ? (
          <div className="rounded-xl border p-6 text-center text-sm text-muted-foreground">
            No active sessions found.
          </div>
        ) : (
          sessions.map((session) => {
            const device = getDeviceInfo(session.user_agent);
            const DeviceIcon = device.icon;

            return (
              <div
                key={session.id}
                className="rounded-xl border bg-background p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <DeviceIcon className="size-5 text-muted-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium">{device.name}</h3>

                      {session.isCurrent && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          <ShieldCheck className="size-3" />
                          Current device
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {device.browser}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {session.ip_address && <span>{session.ip_address}</span>}

                      <span>{formatLastActive(session.last_used_at)}</span>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <button
                      type="button"
                      onClick={() => signOutSession(session.id)}
                      disabled={signingOut === session.id}
                      className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50"
                    >
                      {signingOut === session.id
                        ? "Signing out..."
                        : "Sign out"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
