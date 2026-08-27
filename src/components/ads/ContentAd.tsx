"use client";

import { useEffect } from "react";

export default function ContentAd() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-8649110588500050"
      data-ad-slot="3100440047"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
