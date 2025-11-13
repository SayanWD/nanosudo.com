import { createClient } from "@supabase/supabase-js";

import { clientEnv, serverEnv } from "@/config";

if (!clientEnv.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL is not defined. Cannot initialize Supabase admin client.",
  );
}

if (!serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is not defined. Cannot initialize Supabase admin client.",
  );
}

export const supabaseAdmin = createClient(
  clientEnv.NEXT_PUBLIC_SUPABASE_URL,
  serverEnv.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
    },
  },
);
