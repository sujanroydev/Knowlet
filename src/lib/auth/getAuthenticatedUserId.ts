import { cookies } from "next/headers";

import { verifyAccessToken } from "./tokens";
import { refreshAccessToken } from "./refreshAccessToken";

export async function getAuthenticatedUserId() {
  const cookieStore = await cookies();

  let accessToken = cookieStore.get("access_token")?.value;

  let payload = await verifyAccessToken(accessToken);

  if (!payload) {
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      throw new Error("Unauthorized");
    }

    const refreshed = await refreshAccessToken(refreshToken, cookieStore);

    if (!refreshed) {
      throw new Error("Unauthorized");
    }

    accessToken = cookieStore.get("access_token")?.value;

    payload = await verifyAccessToken(accessToken);

    if (!payload) {
      throw new Error("Unauthorized");
    }
  }

  return payload.user_id;
}
