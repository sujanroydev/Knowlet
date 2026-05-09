import { SupabaseClient } from "@supabase/supabase-js";

declare global {
  var supabase: {
    client: SupabaseClient | null;
  };
}

export {};
