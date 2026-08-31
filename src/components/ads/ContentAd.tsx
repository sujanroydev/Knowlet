"use client";

import { useEffect, useRef } from "react";

export default function ContentAd() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    initialized.current = true;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <div className="bg-muted text-foreground rounded-lg">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8649110588500050"
        data-ad-slot="3100440047"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
