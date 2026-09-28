import { createHash, randomBytes } from "crypto";
import { jwtVerify, SignJWT, type JWTPayload } from "jose";

export interface AccessTokenPayload extends JWTPayload {
  user_id: string;
  session_id: string;
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return new TextEncoder().encode(secret);
}

export async function createAccessToken(userId: string, sessionId: string) {
  return new SignJWT({
    user_id: userId,
    session_id: sessionId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(getJwtSecret());
}

export async function verifyAccessToken(
  token: string,
): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify<AccessTokenPayload>(
      token,
      getJwtSecret(),
      {
        algorithms: ["HS256"],
      },
    );

    if (
      typeof payload.user_id !== "string" ||
      typeof payload.session_id !== "string"
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function createRefreshToken() {
  return randomBytes(32).toString("base64url");
}

export function hashRefreshToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
