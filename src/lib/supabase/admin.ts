import "server-only";
import { createClient } from "@supabase/supabase-js";

/** Secret-key client that bypasses Row Level Security. Server code only, never for user-driven queries without checks. */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
