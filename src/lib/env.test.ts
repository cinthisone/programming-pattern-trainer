import { afterEach, describe, expect, it } from "vitest";
import { isAuthDisabled, isSupabaseConfigured, allowGuestExecution } from "@/lib/env";

const keys = [
  "AUTH_DISABLED",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

const original = Object.fromEntries(keys.map((key) => [key, process.env[key]]));

afterEach(() => {
  for (const key of keys) {
    const value = original[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

describe("auth disablement", () => {
  it("disables auth when Supabase is not configured", () => {
    delete process.env.AUTH_DISABLED;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    expect(isSupabaseConfigured()).toBe(false);
    expect(isAuthDisabled()).toBe(true);
    expect(allowGuestExecution()).toBe(true);
  });

  it("can force auth off even if Supabase keys exist", () => {
    process.env.AUTH_DISABLED = "true";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";
    expect(isAuthDisabled()).toBe(true);
  });

  it("can force auth on without Supabase", () => {
    process.env.AUTH_DISABLED = "false";
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    expect(isAuthDisabled()).toBe(false);
  });
});
