"use client";

import { getUserReferralCode } from "@/actions/profile";
import { Gift, Share2, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function ReferralCard() {
  const [referralCode, setReferralCode] = useState("");
  useEffect(() => {
    void (async () => {
      setReferralCode(await getUserReferralCode());
    })();
  }, []);
  return (
    <button
      type="button"
      className="group w-full rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Gift size={24} strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-gray-900">
            Refer & Earn
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Invite your friends to learn with Knowlet
          </p>

          {referralCode && (
            <p className="mt-2 text-xs text-gray-400">
              Your code:{" "}
              <span className="font-medium text-gray-600">{referralCode}</span>
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 text-gray-400 transition group-hover:text-blue-600">
          <Share2 size={18} />
          <ChevronRight size={20} />
        </div>
      </div>
    </button>
  );
}
