import { NextRequest, NextResponse } from "next/server";

import { authGate } from "@/lib/auth/authGate";

import {
  deactivatePushSubscriptionByEndpoint,
  upsertPushSubscription
} from "@/db/pushSubscription";

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

    await upsertPushSubscription(subscription, payload.user_id);

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

    await deactivatePushSubscriptionByEndpoint(subscription.endpoint);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
