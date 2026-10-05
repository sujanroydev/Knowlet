import { NextResponse, NextRequest } from "next/server";
import { UserRole } from "@/types/user";
import { verifyAccessToken } from "./tokens";
import { getActiveUserRole } from "@/db/user";
import { clearAuthCookies } from "./cookies";

export async function authGate(req: NextRequest, role?: UserRole) {
  const accessToken = req.cookies.get("access_token")?.value;
  const payload = await verifyAccessToken(accessToken);

  if (!payload) {
    const res = NextResponse.json(
      { error: { message: "Unauthorized" } },
      { status: 401 },
    );

    clearAuthCookies(res.cookies);

    return { ok: false, res };
  }

  if (role === "admin") {
    const role = await getActiveUserRole(payload.user_id);

    if (role !== "admin") {
      const res = NextResponse.json(
        { error: { message: "Unauthorized" } },
        { status: 401 },
      );

      return { ok: false, res };
    }
  }

  return { ok: true, payload };
}
