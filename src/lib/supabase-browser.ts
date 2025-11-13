import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { clientEnv } from "@/config";

if (
  !clientEnv.NEXT_PUBLIC_SUPABASE_URL ||
  !clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  throw new Error("Supabase client env vars are missing.");
}

const SUPABASE_URL = clientEnv.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export function getSupabaseBrowserClient(): SupabaseClient {
  return createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
      },
    },
  );
}
