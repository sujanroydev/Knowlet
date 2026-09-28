import { createHash, randomBytes } from "crypto";
import { SignJWT } from "jose";

export async function createAccessToken(userId: string, sessionId: string) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return new SignJWT({
    user_id: userId,
    session_id: sessionId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(new TextEncoder().encode(secret));
}

export function createRefreshToken() {
  return randomBytes(32).toString("base64url");
}

export function hashRefreshToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
