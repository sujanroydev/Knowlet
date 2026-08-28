"use server";

import { cookies } from "next/headers";

import { verifyJwt } from "@/lib/auth";
import { deleteLike, insertLike } from "@/db/user/like";

export async function likeResource(resourceId: string) {
  const token = (await cookies()).get("token")?.value;
  const { ok, payload } = await verifyJwt(token);

  if (!ok || !payload) throw new Error("Unauthorized");

  if (!resourceId) throw new Error("Missing resource id");

  await insertLike(payload.user_id, resourceId);
}

export async function unlikeResource(resourceId: string) {
  const token = (await cookies()).get("token")?.value;
  const { ok, payload } = await verifyJwt(token);

  if (!ok || !payload) throw new Error("Unauthorized");

  if (!resourceId) throw new Error("Missing resource id");

  await deleteLike(payload.user_id, resourceId);
}
