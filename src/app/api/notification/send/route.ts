import { verifyAdmin } from "@/lib/auth";
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
    const { title, body, icon, badge, image, tag, url } = await req.json();

    const admin = await verifyAdmin(req.cookies.get("token")?.value);

    if (!admin) {
      return NextResponse.json(
        { error: { message: "Unauthorized User" } },
        { status: 403 },
      );
    }

    const db = await connectDb();

    const { data, error } = await db
      .from("push_subscriptions")
      .select("id, user_id, endpoint, auth, p256dh")
      .eq("is_active", true);

    if (error) {
      throw new Error(error.message);
    }

    const payload = JSON.stringify({
      title,
      body,
      icon,
      badge,
      image,
      tag,
      url,
    });

    const { data: notification } = await db
      .from("notifications")
      .insert({
        type: "resource",
        title,
        body,
        icon,
        // badge,
        image,
        // tag,
        action_url: url,
      })
      .select()
      .single();

    const notificationId = notification.id;
    let userNotificationArr: {
      user_id: string;
      notification_id: string;
    }[] = [];

    const results = await Promise.allSettled(
      data.map(async (row) => {
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
        } finally {
          userNotificationArr.push({
            user_id: row.user_id,
            notification_id: notificationId,
          });
        }
      }),
    );

    await db.from("user_notifications").insert(userNotificationArr);

    const success = results.filter((r) => r.status === "fulfilled").length;

    return NextResponse.json({
      success: true,
      data: {
        total: data.length,
        sent: success,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: { message: "Server Error" } },
      { status: 500 },
    );
  }
}
