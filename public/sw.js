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
  const data = event.data?.json() || {};

  event.waitUntil(
    self.registration
      .showNotification(data.title || "Knowlet", {
        body: data.body,
        icon: data.icon,
        badge: data.badge,
        image: data.image,
        tag: data.tag,
        data: {
          url: data.url,
          notificationId: data.notificationId,
        },
      })
      .catch((err) => {
        console.error("showNotification error:", err);
      }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const notificationId = event.notification.data?.notificationId;
  const url = new URL(event.notification.data?.url || "/", self.location.origin)
    .href;

  event.waitUntil(
    (async () => {
      if (notificationId) {
        try {
          await fetch("/api/notification/read", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notification_id: notificationId }),
          });
        } catch (err) {
          console.error("Failed to track notification click:", err);
        }
      }

      const clientList = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }

      return clients.openWindow(url);
    })(),
  );
});
