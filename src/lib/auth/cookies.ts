import { NextResponse } from "next/server";
import { type ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";

type AuthCookies = NextResponse["cookies"] | ResponseCookies;

export function setAuthCookies(
  cookies: AuthCookies,
  accessToken: string,
  refreshToken: string,
) {
  const secure = process.env.NODE_ENV === "production";

  cookies.set("access_token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 15,
  });

  cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearAuthCookies(cookies: AuthCookies) {
  cookies.delete("access_token");
  cookies.delete("refresh_token");
}
