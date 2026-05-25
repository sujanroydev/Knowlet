"use client";

import { useEffect } from "react";

export default function SWRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");

        console.log("SW registered:", registration);
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
        console.error("Failed to check subscription", error);
      }
    }, 6000);
  }, []);

  return null;
}

async function subscribe() {
  const registration = await navigator.serviceWorker.ready;

  const permission = await Notification.requestPermission();

  if (permission !== "granted") return;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    ),
  });

  await fetch("/api/notification/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export { subscribe };
