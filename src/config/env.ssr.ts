/**
 * SSR-safe environment configuration.
 * Provides access to both server and client variables for server components/actions.
 */
import { clientEnvSchema } from "./env.client";
import type { ClientEnv } from "./env";
import { serverEnvSchema, type ServerEnv } from "./env.server";

type SsrEnv = ServerEnv & ClientEnv;

let cachedSsrEnv: SsrEnv | null = null;

const ensureSsrEnv = (): SsrEnv => {
  if (cachedSsrEnv) {
    return cachedSsrEnv;
  }
  if (typeof window !== "undefined") {
    throw new Error("ssrEnv is only available on the server runtime.");
  }
  cachedSsrEnv = {
    ...serverEnvSchema.parse(process.env),
    ...clientEnvSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_BREVO_SENDER_EMAIL: process.env.NEXT_PUBLIC_BREVO_SENDER_EMAIL,
    }),
  } satisfies SsrEnv;
  return cachedSsrEnv;
};

export const ssrEnv: SsrEnv = new Proxy({} as SsrEnv, {
  get: (_target, property: string | symbol): unknown => {
    const env = ensureSsrEnv();
    return env[property as keyof SsrEnv];
  },
});

export type { SsrEnv };
