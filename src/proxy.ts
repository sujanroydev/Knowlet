import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, verifyJwt } from "./lib/auth";

function slugify(value: string) {
  return value.replace(/_/g, "-");
}

function redirectToSignin(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/signin", req.url));

  res.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return res;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

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
  if (
    pathname.startsWith("/profile") ||
    pathname.startsWith("/history") ||
    pathname.startsWith("/bookmarks") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/settings/password")
  ) {
    const { ok } = await verifyJwt(token);

    if (!ok) return redirectToSignin(req);
  }

  // ADMIN
  if (pathname.startsWith("/dashboard")) {
    const { ok, reason } = await verifyAdmin(token);

    if (!ok) {
      if (reason === "NOT_ADMIN") {
        return NextResponse.redirect(new URL("/forbidden", req.url));
      } else {
        return redirectToSignin(req);
      }
    }
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
  ],
};
