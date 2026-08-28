"use server";

import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";

import { markNotificationAsRead as _markNotificationAsRead } from "@/db/user/notification";

export async function markNotificationAsRead(notificationId: string) {
  const token = (await cookies()).get("token")?.value;
  const { ok, payload } = await verifyJwt(token);

  if (!ok) throw new Error("Unauthorized");

  return await _markNotificationAsRead(payload.user_id, notificationId);
}
