"use client";

import { useEffect, useState } from "react";

export default function Download() {
  const [installed, setInstalled] = useState(false);
  const [installSupported, setInstallSupported] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const isInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    setInstalled(isInstalled);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallSupported(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  if (installed) return null;

  return (
    <section className="text-center py-12 px-4">
      <h2 className="text-xl font-semibold text-blue-900">Get Knowlet App</h2>

      <p className="text-gray-700 mt-2 mb-6">
        Install the app or download the APK.
      </p>

      {installSupported ? (
        <button
          onClick={installApp}
          className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
        >
          Install App
        </button>
      ) : (
        <a
          href="/assets/knowlet.apk"
          download
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
        >
          Download APK
        </a>
      )}
    </section>
  );
}
