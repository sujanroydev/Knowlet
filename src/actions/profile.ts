"use server";

import {
  getUserReferralCode as _getUserReferralCode,
  getReferredUsers as _getReferredUsers,
} from "@/db/user";
import { getAuthenticatedUserId } from "@/lib/auth/getAuthenticatedUserId";

export async function getUserReferralCode(): Promise<string> {
  const userId = await getAuthenticatedUserId();

  return await _getUserReferralCode(userId);
}

export async function getReferredUsers(referralCode: string) {
  return await _getReferredUsers(referralCode);
}
