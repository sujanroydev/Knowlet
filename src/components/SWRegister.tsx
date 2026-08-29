"use client";

import { subscribe } from "@/app/(app)/notifications/notification-client";
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

      if (!("Notification" in window) || !("permissions" in navigator)) {
        return;
      }

      const permissionStatus = await navigator.permissions.query({
        name: "notifications",
      });

      const handleChange = () => {
        if (permissionStatus.state === "granted") {
          try {
            subscribe();
          } catch {}
        } else if (permissionStatus.state === "denied") {
          // TODO: delete subscription of this device using session token
        }
      };

      permissionStatus.addEventListener("change", handleChange);

      return () => {
        permissionStatus.removeEventListener("change", handleChange);
      };
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
