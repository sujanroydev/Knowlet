import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:konwlet.official@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const { title, body, icon, badge, image, tag, url } = await req.json();

    const db = await connectDb();

    const { data, error } = await db
      .from("push_subscriptions")
      .select("*")
      .eq("is_active", true);

    if (error) throw new Error(error.message);

    const payload = JSON.stringify({
      title,
      body,
      icon,
      badge,
      image,
      tag,
      url,
    });

    for (let row of data) {
      try {
        await webpush.sendNotification(
          {
            endpoint: row.endpoing,
            keys: { auth: row.auth, p256dh: row.p256dh },
          },
          payload,
        );
      } catch (err) {
        await db
          .from("subscriptions")
          .update({ is_active: false })
          .eq("id", row.id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: { message: "Server Error" } },
      { status: 500 },
    );
  }
}
