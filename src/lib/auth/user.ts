import { cache } from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAuthDisabled, isSupabaseConfigured } from "@/lib/env";

export type AppUser = {
  id: string;
  email: string | undefined;
};

export const LOCAL_USER: AppUser = {
  id: "local-dev",
  email: "local@pattern-trainer.dev",
};

export const getCurrentUser = cache(async (): Promise<AppUser | null> => {
  if (isAuthDisabled()) {
    return LOCAL_USER;
  }

  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email,
  };
});

export async function requireUser(): Promise<AppUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}
