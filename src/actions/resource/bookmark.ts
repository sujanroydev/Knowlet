"use server";

import { cookies } from "next/headers";

import { deleteBookmark, insertBookmark } from "@/db/user/bookmark";
import { verifyJwt } from "@/lib/auth";

export async function bookmarkResource(resourceId: string) {
  const token = (await cookies()).get("token")?.value;
  const { ok, payload } = await verifyJwt(token);

  if (!ok || !payload) throw new Error("Unauthorized");

  if (!resourceId) throw new Error("Missing resource id");

  await insertBookmark(payload.user_id, resourceId);
}

export async function unbookmarkResource(resourceId: string) {
  const token = (await cookies()).get("token")?.value;
  const { ok, payload } = await verifyJwt(token);

  if (!ok || !payload) throw new Error("Unauthorized");

  if (!resourceId) throw new Error("Missing resource id");

  await deleteBookmark(payload.user_id, resourceId);
}
