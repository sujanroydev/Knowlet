"use server";

import { deleteLike, insertLike } from "@/db/user/like";
import { getAuthenticatedUserId } from "@/lib/auth/getAuthenticatedUserId";

export async function likeResource(resourceId: string) {
  const userId = await getAuthenticatedUserId();

  if (!resourceId) throw new Error("Missing resource id");

  await insertLike(userId, resourceId);
}

export async function unlikeResource(resourceId: string) {
  const userId = await getAuthenticatedUserId();

  if (!resourceId) throw new Error("Missing resource id");

  await deleteLike(userId, resourceId);
}
