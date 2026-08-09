import { createClient } from "@supabase/supabase-js";

let supabaseUrl = process.env.SUPABASE_URL;
let supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Supabase keys not found.");
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
