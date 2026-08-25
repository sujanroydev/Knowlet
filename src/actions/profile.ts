"use server";

import { cookies } from "next/headers";

import { verifyJwt } from "@/lib/auth";
import {
  getUserReferralCode as _getUserReferralCode,
  getReferredUsers as _getReferredUsers,
} from "@/db/user";

export async function getUserReferralCode(): Promise<string> {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  const { ok, payload, reason } = await verifyJwt(token);

  if (!ok || !payload) throw new Error(reason);

  return await _getUserReferralCode(payload.user_id);
}

export async function getReferredUsers(referralCode: string) {
  return await _getReferredUsers(referralCode);
}
