import { jwtVerify, JWTPayload } from "jose";
import connectDb from "./db";

type AuthPayload = JWTPayload & {
  user_id: string;
};

async function verifyJwt(token?: string | null) {
  if (!token) {
    return { ok: false, reason: "NO_TOKEN" } as const;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify<AuthPayload>(token, secret);
    return { ok: true, payload } as const;
  } catch (err: any) {
    if (err?.code === "ERR_JWT_EXPIRED") {
      return { ok: false, reason: "EXPIRED" } as const;
    }
    return { ok: false, reason: "INVALID" } as const;
  }
}

async function verifyUser(token: string | undefined | null) {
  const { ok, payload, reason } = await verifyJwt(token);
  if (!ok) return { ok, reason } as const;

  const db = await connectDb();
  const { data, error } = await db
    .from("users")
    .select("is_active")
    .eq("id", payload.user_id)
    .maybeSingle();

  if (error || !data || !data.is_active)
    return { ok: false, reason: "INACTIVE" } as const;

  return { ok: true, payload } as const;
}

async function verifyAdmin(token: string | undefined | null) {
  const { ok, payload, reason } = await verifyJwt(token);
  if (!ok) return { ok, reason } as const;

  const db = await connectDb();
  const { data, error } = await db
    .from("users")
    .select("role")
    .eq("id", payload.user_id)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data || data.role !== "admin")
    return { ok: false, reason: "NOT_ADMIN" } as const;

  return { ok: true, payload } as const;
}

export { verifyJwt, verifyUser, verifyAdmin };
