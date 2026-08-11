import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import { getHistory } from "@/db/user/history";
import { authGate } from "@/lib/auth/authGate";

export async function POST(req: NextRequest) {
  try {
    const { resource_id } = await req.json();

    if (!resource_id) {
      return NextResponse.json(
        { error: { message: "Missing resource id" } },
        { status: 400 },
      );
    }

    const { ok, res, payload } = await authGate(req, "jwt");
    if (!ok || !payload) return res;

    const { error } = await supabase.rpc("add_view_history", {
      p_user_id: payload.user_id,
      p_resource_id: resource_id,
    });

    if (error)
      return NextResponse.json(
        { error: { message: error.message } },
        { status: 500 },
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Internal Server Error" } },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { ok, res, payload } = await authGate(req, "jwt");
    if (!ok || !payload) return res;

    // select all history for the user
    const history = await getHistory(payload.user_id);

    return NextResponse.json({ data: history });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Internal Server Error" } },
      { status: 500 },
    );
  }
}
