import { clearAuthCookies } from "@/lib/auth/cookies";
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  clearAuthCookies(res);

  return res;
}
