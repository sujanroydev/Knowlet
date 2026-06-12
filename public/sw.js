self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cache) => caches.delete(cache)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("push", (event) => {
  const { title, options } = event.data?.json() || {};

  event.waitUntil(
    self.registration
      .showNotification(title || "Knowlet", options)
      .catch((err) => {
        console.error("showNotification error:", err);
      }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const { notificationId, action_url } = event.notification.data;
  const url = new URL(action_url || "/", self.location.origin).href;

  event.waitUntil(
    (async () => {
      if (notificationId) {
        void fetch("/api/notification/read", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notification_id: notificationId }),
        }).catch(console.error);
      }

      const clientList = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of clientList) {
        if (client.url === action_url && "focus" in client) {
          return client.focus();
        }
      }

      return clients.openWindow(action_url);
    })(),
  );
});
