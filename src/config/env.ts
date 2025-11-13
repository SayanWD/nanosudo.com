/**
 * Environment configuration shared between client and server.
 * Provides strongly typed access to all validated variables.
 */
import { clientEnvSchema } from "./env.client";
import { serverEnvSchema, type ServerEnv } from "./env.server";

let cachedServerEnv: ServerEnv | null = null;

const ensureServerEnv = (): ServerEnv => {
  if (cachedServerEnv) {
    return cachedServerEnv;
  }
  if (typeof window !== "undefined") {
    throw new Error("serverEnv is only available on the server runtime.");
  }
  cachedServerEnv = serverEnvSchema.parse(process.env);
  return cachedServerEnv;
};

export const serverEnv: ServerEnv = new Proxy({} as ServerEnv, {
  get: (_target, property: string | symbol): unknown => {
    const env = ensureServerEnv();
    return env[property as keyof ServerEnv];
  },
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_BREVO_SENDER_EMAIL: process.env.NEXT_PUBLIC_BREVO_SENDER_EMAIL,
});

export type { ServerEnv };
export type ClientEnv = typeof clientEnv;
