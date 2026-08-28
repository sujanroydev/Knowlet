"use server";

import { addViewHistory as _addViewHistory } from "@/db/resource/history";
import { getHistory as _getHistory } from "@/db/user/history";
import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function addViewHistory(resourceId: string) {
  const token = (await cookies()).get("token")?.value;
  const { ok, payload } = await verifyJwt(token);

  if (!ok) throw new Error("Unauthorized");

  if (!resourceId) throw new Error("Missing resource id");

  return await _addViewHistory(payload.user_id, resourceId);
}

export async function getHistory() {
  const token = (await cookies()).get("token")?.value;
  const { ok, payload } = await verifyJwt(token);

  if (!ok) throw new Error("Unauthorized");

  return await _getHistory(payload.user_id);
}
