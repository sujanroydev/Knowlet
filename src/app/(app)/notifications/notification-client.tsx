"use client";

import { subscribe } from "@/components/SWRegister";
import { useEffect, useState } from "react";

export default function NotificationClient({
  notifications,
  user_subscriptions,
}: {
  notifications: any;
  user_subscriptions: any[];
}) {
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    checkSubscription();
  }, []);

  async function checkSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        setSubscribed(false);
        return;
      }

      const exists = user_subscriptions.find(
        (i) => i.endpoint === subscription.endpoint,
      );

      setSubscribed(!!exists?.is_active);
      return subscription;
    } catch (error) {
      console.error("Failed to check subscription", error);
    }
  }

  async function toggleSubscription() {
    if (subscribed) {
      await fetch("/api/notification/subscribe", {
        method: "PATCH",
        body: JSON.stringify(await checkSubscription()),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setSubscribed(false);
    } else {
      await subscribe();
      setSubscribed(true);
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

      await fetch(`/api/notification/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notification_id: notificationId }),
      });
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  }

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
                subscribed
                  ? "bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-red-200"
                  : "bg-gradient-to-r from-emerald-500 to-green-500 hover:shadow-green-200"
              }
            `}
          >
            <span className="relative z-10">
              {subscribed ? "Unsubscribe" : "Subscribe"}
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
