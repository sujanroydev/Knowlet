import { NextResponse, NextRequest } from "next/server";
import { verifyJwt, verifyUser, verifyAdmin } from ".";

type Role = "jwt" | "user" | "admin";

export async function authGate(req: NextRequest, role: Role = "jwt") {
  const token = req.cookies.get("token")?.value;

  if (role === "user") {
    const result = await verifyUser(token);

    if (!result.ok) {
      const res = NextResponse.json(
        { error: { message: result.reason } },
        { status: 401 },
      );

      res.cookies.set("token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
      });

      return { ok: false, res };
    }

    return {
      ok: true,
      payload: result.payload,
    };
  } else if (role === "admin") {
    const result = await verifyAdmin(token);

    if (!result.ok) {
      const res = NextResponse.json(
        { error: { message: result.reason } },
        { status: 401 },
      );

      res.cookies.set("token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
      });

      return { ok: false, res };
    }

    return {
      ok: true,
      payload: result.payload,
    };
  } else {
    const jwtResult = await verifyJwt(token);

    if (!jwtResult.ok) {
      const res = NextResponse.json(
        { error: { message: jwtResult.reason } },
        { status: 401 },
      );

      res.cookies.set("token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
      });

      return { ok: false, res };
    }

    return {
      ok: true,
      payload: jwtResult.payload,
    };
  }
}
