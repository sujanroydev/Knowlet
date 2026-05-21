self.addEventListener("push", (event) => {
  console.log("notification came");

  const data = event.data?.json() || {};
  const title = data.title || "Your Notes Are Ready";

  event.waitUntil(
    self.registration
      .showNotification(title, {
        body: data.body || "Jump back in and keep learning with Knowlet.",
        icon: data.icon || "/icons/knowlet/android-chrome-192x192.png",
        badge: data.badge || "/icons/knowlet/favicon-32x32.png",
        image: data.image,
        tag: data.tag,
        data: {
          url: data.url || "/",
        },
      })
      .catch((err) => {
        console.error("showNotification error:", err);
      }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "/", self.location.origin)
    .href;
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        return clients.openWindow(url);
      }),
  );
});
