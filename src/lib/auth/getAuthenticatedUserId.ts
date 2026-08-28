import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { verifyJwt } from "@/lib/auth";

export async function getAuthenticatedUserId(req?: NextRequest) {
  const token = req
    ? req.cookies.get("token")?.value
    : (await cookies()).get("token")?.value;

  const { ok, reason, payload } = await verifyJwt(token);

  if (!ok) throw new Error(reason);

  return payload.user_id;
}
