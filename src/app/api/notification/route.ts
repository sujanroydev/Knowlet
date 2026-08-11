import { authGate } from "@/lib/auth/authGate";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { ok, res, payload } = await authGate(req, "jwt");
    if (!ok || !payload) return res;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Server error" } },
      { status: 500 },
    );
  }
}
