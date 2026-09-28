import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { verifyAccessToken } from "./tokens";

export async function getAuthenticatedUserId(req?: NextRequest) {
  const accessToken = req
    ? req.cookies.get("access_token")?.value
    : (await cookies()).get("access_token")?.value;

  const payload = await verifyAccessToken(accessToken);

  if (!payload) throw new Error("Unauthorized");

  return payload.user_id;
}
