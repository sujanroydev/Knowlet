"use client";

import { subscribe } from "@/components/SWRegister";
import { useState } from "react";

export default function NotificationClient({
  notifications,
  isSubscribed,
}: any) {
  const [subscribed, setSubscribed] = useState(isSubscribed);

  async function toggleSubscription() {
    if (subscribed) {
      await fetch("/api/notification/subscribe", { method: "PATCH" });
      setSubscribed(false);
    } else {
      await subscribe();
      setSubscribed(true);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {/* Subscribe Button */}
      <button
        onClick={toggleSubscription}
        className={`px-4 py-2 rounded mb-6 ${
          subscribed ? "bg-red-500" : "bg-green-500"
        } text-white`}
      >
        {subscribed
          ? "Unsubscribe Push Notifications"
          : "Subscribe Push Notifications"}
      </button>

      {/* Notification List */}
      <div className="space-y-3">
        {notifications.map((n: any) => (
          <a
            key={n.id}
            href={n.notifications.action_url || "#"}
            className="block p-4 border rounded hover:bg-gray-50"
          >
            <div className="flex justify-between">
              <h2 className="font-semibold">{n.notifications.title}</h2>

              {!n.is_read && <span className="text-xs text-blue-500">NEW</span>}
            </div>

            <p className="text-sm text-gray-600">{n.notifications.body}</p>

            <p className="text-xs text-gray-400 mt-1">
              {new Date(n.created_at).toLocaleString()}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
