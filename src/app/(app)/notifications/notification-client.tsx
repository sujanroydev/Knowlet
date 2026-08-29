"use client";

import {
  deactivatePushSubscriptionByEndpoint,
  markNotificationAsRead,
  upsertPushSubscription,
} from "@/actions/notification";
import { ActionState } from "@/types/main";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PushSubscription } from "web-push";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);

  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export async function requestNotificationPermission() {
  if (!("Notification" in window) || !("permissions" in navigator)) {
    throw new Error("Notification not supported");
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") throw new Error("Permission not granted");
}

export async function getNotificationPermissionStatus() {
  if (!("Notification" in window) || !("permissions" in navigator)) {
    throw new Error("Notification not supported");
  }

  const permissionStatus = await navigator.permissions.query({
    name: "notifications",
  });

  return permissionStatus.state;
}

export async function getLocalSubscription() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service worker not supported");
  }

  const registration = await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();

  return subscription && (subscription.toJSON() as PushSubscription);
}

export async function localSubscribe() {
  await requestNotificationPermission();

  if (!("serviceWorker" in navigator)) {
    throw new Error("Service worker not supported");
  }

  const registration = await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();

  try {
    // Create subscription only if none exists
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ),
      });
    }
  } catch (error) {
    // Recover from VAPID key mismatch
    if (error instanceof DOMException && error.name === "InvalidStateError") {
      console.log("Old subscription detected. Re-subscribing...");

      if (subscription) {
        await subscription.unsubscribe();
      }

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ),
      });
    } else {
      throw error;
    }
  }

  return subscription && (subscription.toJSON() as PushSubscription);
}

export async function subscribe() {
  const subscription = await localSubscribe();

  // TODO: subscribe this device using session token
  await upsertPushSubscription(subscription);
}

export async function unsubscribe() {
  const subscription = await getLocalSubscription();

  if (!subscription) return;

  // TODO: unsubscribe this device using session token instaed of subscription
  await deactivatePushSubscriptionByEndpoint(subscription.endpoint);
}

export default function NotificationClient({
  notifications,
  user_subscriptions,
}: {
  notifications: any;
  user_subscriptions: any[];
}) {
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [subscribeState, setSubscribeState] = useState<ActionState>("inactive");

  async function updateSubscriptionState() {
    try {
      setSubscribeState("loading");

      const subscription = await getLocalSubscription();

      if (!subscription) {
        setSubscribeState("inactive");
        return;
      }

      const exists = user_subscriptions.find(
        (i) => i.endpoint === subscription.endpoint,
      );

      setSubscribeState(!!exists?.is_active ? "active" : "inactive");

      return subscription;
    } catch {}
  }

  async function toggleSubscription() {
    if (subscribeState === "active") {
      try {
        setSubscribeState("loading");
        await unsubscribe();
        setSubscribeState("inactive");
      } catch (error) {
        setSubscribeState("active");
        toast.error((error as any).message || "Failed to unsubscribe");
        return;
      }
    } else {
      try {
        setSubscribeState("loading");
        await subscribe();
        setSubscribeState("active");
      } catch (error) {
        setSubscribeState("inactive");
        toast.error((error as any).message || "Failed to subscribe");
      }
    }
  }

  async function markAsRead(id: string, notificationId: string) {
    try {
      setLocalNotifications((prev: any[]) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                is_read: true,
                read_at: new Date().toISOString(),
              }
            : n,
        ),
      );

      await markNotificationAsRead(notificationId);
    } catch {}
  }

  useEffect(() => {
    updateSubscriptionState();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Notifications
            </h1>

            <p className="text-slate-500 mt-1">
              Stay updated with your latest activity and announcements.
            </p>
          </div>

          {/* Subscribe Button */}
          <button
            onClick={toggleSubscription}
            className={`relative overflow-hidden px-5 py-3 rounded-2xl text-white font-medium transition-all duration-300 shadow-lg hover:scale-[1.02] active:scale-[0.98]
              ${
                subscribeState === "active"
                  ? "bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-red-200"
                  : subscribeState === "inactive"
                    ? "bg-gradient-to-r from-emerald-500 to-green-500 hover:shadow-green-200"
                    : "bg-gradient-to-r from-amber-500 to-emerald-500 hover:shadow-amber-200"
              }
            `}
            disabled={subscribeState === "loading"}
          >
            <span className="relative z-10">
              {subscribeState === "active"
                ? "Unsubscribe"
                : subscribeState === "inactive"
                  ? "Subscribe"
                  : "Updating..."}
            </span>

            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          {localNotifications.map((n: any) => (
            <a
              key={n.id}
              href={n.notifications.action_url || "#"}
              onClick={() => markAsRead(n.id, n.notifications?.id)}
              className={`group block rounded-3xl border backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
            ${
              n.is_read
                ? "bg-white border-slate-200 hover:border-slate-300"
                : "bg-blue-50/70 border-blue-200 hover:border-blue-300 shadow-blue-100"
            }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold
                ${
                  n.is_read
                    ? "bg-slate-100 text-slate-600"
                    : "bg-blue-500 text-white shadow-lg shadow-blue-200"
                }`}
                >
                  🔔
                </div>

                <div className="flex-1 min-w-0">
                  {/* Top Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                        {n.notifications.title}
                      </h2>

                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        {n.notifications.body}
                      </p>
                    </div>

                    {!n.is_read && (
                      <span className="shrink-0 rounded-full bg-blue-500 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white shadow">
                        NEW
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      {new Date(n.created_at).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>

                    <span className="text-sm font-medium text-blue-500 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                      Open →
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}

          {/* Empty State */}
          {notifications.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-12 text-center">
              <div className="text-5xl mb-4">🔕</div>

              <h3 className="text-lg font-semibold text-slate-800">
                No notifications yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                When new updates arrive, they’ll appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
