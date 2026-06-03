import { authGate } from "@/lib/auth/authGate";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const subscription = await req.json();
    const { ok, res, payload } = await authGate(req, "jwt");

    if (!ok || !payload) return res;

    if (!subscription?.endpoint) {
      return NextResponse.json(
        { success: false, error: "Invalid subscription" },
        { status: 400 },
      );
    }

    const db = await connectDb();

    const { error } = await db.from("push_subscriptions").upsert(
      {
        user_id: payload?.user_id ?? null,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "endpoint" },
    );

    if (error) throw new Error("Database Error");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const subscription = await req.json();
    const { ok, res, payload } = await authGate(req, "jwt");

    if (!ok || !payload) return res;

    if (!subscription?.endpoint) {
      return NextResponse.json(
        { success: false, error: "Invalid subscription" },
        { status: 400 },
      );
    }

    const db = await connectDb();

    const { error } = await db
      .from("push_subscriptions")
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq("endpoint", subscription.endpoint);

    if (error) throw new Error("Database Error");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
