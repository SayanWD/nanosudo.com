/**
 * Server-only environment configuration and validation.
 * Validates sensitive variables and ensures consistent runtime behaviour.
 */
import { z } from "zod";

export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "SUPABASE_SERVICE_ROLE_KEY is required for backend operations.")
    .optional(),
  BREVO_API_KEY: z
    .string()
    .min(1, "BREVO_API_KEY is required to send transactional emails.")
    .optional(),
  BREVO_NOTIFICATION_EMAIL: z
    .string()
    .email("BREVO_NOTIFICATION_EMAIL must be a valid email address.")
    .optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
