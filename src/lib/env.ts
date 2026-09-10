import { z } from "zod";

const optionalString = z.string().optional();

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: optionalString,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString,
  SUPABASE_SERVICE_ROLE_KEY: optionalString,
  JUDGE0_BASE_URL: optionalString,
  JUDGE0_API_KEY: z.string().optional(),
  AI_GATEWAY_API_KEY: z.string().optional(),
  AI_MODEL: z.string().optional(),
  AUTH_DISABLED: z.string().optional(),
  ALLOW_GUEST_EXECUTION: z.string().optional(),
  MAX_SOURCE_CHARS: z.string().optional(),
  MAX_TIMEOUT_MS: z.string().optional(),
});

function readEnv() {
  return envSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    JUDGE0_BASE_URL: process.env.JUDGE0_BASE_URL,
    JUDGE0_API_KEY: process.env.JUDGE0_API_KEY,
    AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY,
    AI_MODEL: process.env.AI_MODEL,
    AUTH_DISABLED: process.env.AUTH_DISABLED,
    ALLOW_GUEST_EXECUTION: process.env.ALLOW_GUEST_EXECUTION,
    MAX_SOURCE_CHARS: process.env.MAX_SOURCE_CHARS,
    MAX_TIMEOUT_MS: process.env.MAX_TIMEOUT_MS,
  });
}

export function isSupabaseConfigured(): boolean {
  const env = readEnv();
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function isAuthDisabled(): boolean {
  const flag = readEnv().AUTH_DISABLED;
  if (flag === "true") {
    return true;
  }
  if (flag === "false") {
    return false;
  }
  return !isSupabaseConfigured();
}

export function getPublicSupabaseConfig(): {
  url: string;
  anonKey: string;
} {
  const env = readEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase public environment variables are not configured");
  }
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function getServiceRoleKey(): string {
  const key = readEnv().SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }
  return key;
}

export function allowGuestExecution(): boolean {
  return isAuthDisabled() || readEnv().ALLOW_GUEST_EXECUTION === "true";
}

export function getMaxSourceChars(): number {
  return Number(readEnv().MAX_SOURCE_CHARS ?? 65536);
}

export function getMaxTimeoutMs(): number {
  return Number(readEnv().MAX_TIMEOUT_MS ?? 8000);
}

export function getJudge0Config(): { baseUrl: string; apiKey: string } | null {
  const env = readEnv();
  const baseUrl = env.JUDGE0_BASE_URL?.trim().replace(/\/+$/, "");
  const apiKey = env.JUDGE0_API_KEY?.trim();
  if (!baseUrl || !apiKey) {
    return null;
  }
  return { baseUrl, apiKey };
}
