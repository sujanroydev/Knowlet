"use client";

import { subscribe } from "@/app/(app)/notifications/notification-client";
import { useEffect } from "react";

export default function SWRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const registerSW = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js");
      } catch (error) {
        console.error("SW registration failed:", error);
      }
    };

    registerSW();

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
