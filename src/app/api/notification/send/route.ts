import { authGate } from "@/lib/auth/authGate";
import connectDb from "@/lib/db";
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

    const subscriptions =
      process.env.NODE_ENV === "development"
        ? data.filter(
            (row) => row.user_id === "7cf87d0f-55d0-4275-93df-d240980e436c",
          )
        : data;

    const { data: notification } = await db
      .from("notifications")
      .insert({ type: "resource", ...notificationData })
      .select()
      .single();

    const notificationId = notification.id;
    const uniqueUserIds = [
      ...new Set(
        subscriptions
          .map((row) => row.user_id)
          .filter((id): id is string => !!id),
      ),
    ];

    await db.from("user_notifications").insert(
      uniqueUserIds.map((userId) => ({
        user_id: userId,
        notification_id: notificationId,
      })),
    );

    const payload = JSON.stringify({ notificationId, ...notificationData });

    const results = await Promise.allSettled(
      subscriptions.map(async (row) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: row.endpoint,
              keys: { auth: row.auth, p256dh: row.p256dh },
            },
            payload,
          );

          return { success: true };
        } catch (err: any) {
          // Remove only invalid/expired subscriptions
          if (err.statusCode === 404 || err.statusCode === 410) {
            await db
              .from("push_subscriptions")
              .update({ is_active: false })
              .eq("id", row.id);
          }

          return {
            success: false,
            statusCode: err.statusCode,
            message: err.message,
          };
        }
      }),
    );

    const success = results.filter(
      (r) => r.status === "fulfilled" && r.value.success,
    ).length;

    const notificationStats = {
      total_users: data.length,
      sent_count: success,
      failed_count: data.length - success,
    };

    await db
      .from("notifications")
      .update(notificationStats)
      .eq("id", notificationId);

    return NextResponse.json({ data: notificationStats });
  } catch (err) {
    return NextResponse.json(
      { error: { message: "Server Error" } },
      { status: 500 },
    );
  }
}
