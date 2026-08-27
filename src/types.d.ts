import { SupabaseClient } from "@supabase/supabase-js";

declare global {
  var supabase: {
    client: SupabaseClient | null;
  };

  interface Window {
    adsbygoogle: unknown[];
  }
}

export {};
