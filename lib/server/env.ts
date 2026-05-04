import { z } from 'zod';

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  ALCHEMY_WEBHOOK_SIGNING_KEY: z.string().optional(),
  ALLOWED_WEBHOOK_IPS: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
});

export function getServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid server env: ${parsed.error.message}`);
  }
  return parsed.data;
}

export function hasServerSupabaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
