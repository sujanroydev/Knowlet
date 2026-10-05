import { NextRequest, NextResponse } from "next/server";
import { PROTECTED_ROUTES } from "./config/app";
import { clearAuthCookies } from "./lib/auth/cookies";
import { verifyAccessToken } from "./lib/auth/tokens";
import { refreshAccessToken } from "./lib/auth/refreshAccessToken";

function slugify(value: string) {
  return value.replace(/_/g, "-");
}

function redirectToSignin(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/signin", req.url));

  clearAuthCookies(res.cookies);

  return res;
}

async function authenticate(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;

  const payload = await verifyAccessToken(accessToken);

  if (payload) {
    return {
      payload,
      response: NextResponse.next(),
    };
  }

  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return {
      payload: null,
      response: redirectToSignin(req),
    };
  }

  const response = NextResponse.next();

  const refreshed = await refreshAccessToken(refreshToken, response.cookies);

  if (!refreshed) {
    clearAuthCookies(response.cookies);

    return {
      payload: null,
      response: NextResponse.redirect(new URL("/signin", req.url)),
    };
  }

  const newAccessToken = response.cookies.get("access_token")?.value;

  const newPayload = await verifyAccessToken(newAccessToken);

  if (!newPayload) {
    clearAuthCookies(response.cookies);

    return {
      payload: null,
      response: NextResponse.redirect(new URL("/signin", req.url)),
    };
  }

  return {
    payload: newPayload,
    response,
  };
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // OLD NOTES REDIRECTS
  if (pathname === "/notes") {
    const url = req.nextUrl.clone();
    url.pathname = "/library";

    return NextResponse.redirect(url, 308);
  }

  if (pathname.startsWith("/notes/")) {
    const parts = pathname.split("/").filter(Boolean);

    // /notes/semester_1/history/dsc_101/unit_1
    if (parts.length === 5) {
      const [, semester, subject, paper, unit] = parts;
      const url = req.nextUrl.clone();

      url.pathname = `/library/${slugify(
        semester,
      )}/${slugify(subject)}/${slugify(paper)}/notes/${slugify(unit)}`;

      return NextResponse.redirect(url, 308);
    }
  }

  // AUTH
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    const { response } = await authenticate(req);

    return response;
  }

  // ADMIN
  if (pathname.startsWith("/dashboard")) {
    const { payload, response } = await authenticate(req);

    if (payload && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }

    return response;
  }

  if (pathname.startsWith("/signup")) {
    const referralCode = req.nextUrl.searchParams.get("ref");

    if (!referralCode) {
      return NextResponse.next();
    }

    const response = NextResponse.next();

    response.cookies.set("referral_code", referralCode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/notes/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/settings/password/:path*",
    "/dashboard/:path*",
    "/history/:path*",
    "/bookmarks/:path*",
    "/knowva/:path*",
    "/knowva/:path*",
    "/signup/:path*",
  ],
};
