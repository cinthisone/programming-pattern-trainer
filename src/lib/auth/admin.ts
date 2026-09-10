import { cache } from "react";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAuthDisabled, isSupabaseConfigured } from "@/lib/env";
import { getCurrentUser } from "@/lib/auth/user";

export const isCurrentUserAdmin = cache(async (): Promise<boolean> => {
  if (isAuthDisabled()) {
    return true;
  }

  const user = await getCurrentUser();
  if (!user || !isSupabaseConfigured()) {
    return false;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  return data.role === "admin";
});

export async function requireAdmin(): Promise<void> {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    notFound();
  }
}
