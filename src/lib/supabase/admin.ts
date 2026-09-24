import "server-only";
import { createClient } from "@supabase/supabase-js";

/** Secret-key client that bypasses Row Level Security. Server code only, never for user-driven queries without checks. */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY (see .env.example) in .env.local or the Vercel project settings.",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
