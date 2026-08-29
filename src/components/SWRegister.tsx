"use client";

import {
  getNotificationPermissionStatus,
  subscribe,
  watchNotificationPermission,
} from "@/app/(app)/notifications/notification-client";
import { useEffect } from "react";

export default function SWRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const setup = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js");
      } catch (error) {
        console.error("SW registration failed:", error);
      }

      const handleChange = async () => {
        const notificationPermissionStatus =
          await getNotificationPermissionStatus();
        if (notificationPermissionStatus === "granted") {
          try {
            subscribe();
          } catch {}
        } else if (notificationPermissionStatus === "denied") {
          // TODO: delete subscription of this device using session token
        }
      };

      await watchNotificationPermission(handleChange);
    };

    setup();

    setTimeout(async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
          subscribe();
        } else if (localStorage.getItem("subscribed") !== "true") {
          subscribe(); //update subscription
          localStorage.setItem("subscribed", "true");
        }
      } catch (error) {
        console.error("Failed to supscribe", error);
      }
    }, 15000);
  }, []);

  return null;
}
