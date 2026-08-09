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

export async function deleteOtp(email: string) {
  const { error } = await supabase
    .from("password_reset_otps")
    .delete()
    .eq("email", email);

  if (error) throw error;
}
