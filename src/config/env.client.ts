/**
 * Client-safe environment configuration.
 * Only exposes variables with the NEXT_PUBLIC_ prefix.
 */
import { z } from "zod";

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL.")
    .optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required.")
    .optional(),
  NEXT_PUBLIC_BREVO_SENDER_EMAIL: z
    .string()
    .email("NEXT_PUBLIC_BREVO_SENDER_EMAIL must be a valid email address.")
    .optional(),
});
