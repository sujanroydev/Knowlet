import { supabase } from "@/lib/supabase";

export async function insertOtp(
  email: string, otpHash: string, expiresAt: string
) {
  const { error } = await supabase
    .from("password_reset_otps")
    .insert({
      email,
      otp_hash: otpHash,
      expires_at: expiresAt,
    });

  if (error) throw error;
}

export async function upsertOtp(
  email: string,
  otpHash: string,
  expiresAt: string,
) {
  const { error } = await supabase
    .from("password_reset_otps")
    .upsert(
      {
        email,
        otp_hash: otpHash,
        expires_at: expiresAt,
      },
      {
        onConflict: "email",
      },
    );

  if (error) throw error;
}

export async function findOtpByEmail(email: string) {
  const { data, error } = await supabase
    .from("password_reset_otps")
    .select("*")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function deleteOtp(email: string) {
  const { error } = await supabase
    .from("password_reset_otps")
    .delete()
    .eq("email", email);

  if (error) throw error;
}
