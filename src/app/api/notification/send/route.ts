import { authGate } from "@/lib/auth/authGate";
import connectDb from "@/lib/db";
import { sendNotification } from "@/services/notification/send";
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:knowlet.official@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const { title, body, icon, badge, image, tag, action_url } =
      await req.json();

    const { ok, res, payload: admin } = await authGate(req, "admin");
    if (!ok || !admin) return res;

    const db = await connectDb();

    const { data, error } = await db
      .from("push_subscriptions")
      .select("id, user_id, endpoint, auth, p256dh")
      .eq("is_active", true);

    if (error) {
      throw new Error(error.message);
    }

    const notificationData = {
      title: title || undefined,
      body: body || undefined,
      image: image || undefined,
      icon: icon || "/icons/web-app-manifest-192x192.png",
      badge: badge || "/icons/favicon-96x96.png",
      tag: tag || undefined,
      action_url: action_url || "https://knowlet.in",
    };

    const subscriptions = (
      process.env.NODE_ENV === "development"
        ? data.filter(
            (row) => row.user_id === "7cf87d0f-55d0-4275-93df-d240980e436c",
          )
        : data
    ).map((s) => ({
      id: s.id,
      user_id: s.user_id,
      endpoint: s.endpoint,
      keys: { p256dh: s.p256dh, auth: s.auth },
    }));

    const notificationStats = sendNotification({
      title,
      subscription: subscriptions,
      options: notificationData,
    });

    return NextResponse.json({ data: notificationStats });
  } catch (err) {
    return NextResponse.json(
      { error: { message: "Server Error" } },
      { status: 500 },
    );
  }
}
