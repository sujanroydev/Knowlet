self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "Your Notes Are Ready";

  event.waitUntil(
    self.registration
      .showNotification(title, {
        body: data.body || "Jump back in and keep learning with Knowlet.",
        icon: data.icon || "/icons/favicon-96x96.png",
        badge: data.badge || "/icons/favicon-96x96.png",
        image: data.image,
        tag: data.tag,
        data: {
          url: data.url || "/",
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
