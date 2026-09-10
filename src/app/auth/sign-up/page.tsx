import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { isAuthDisabled, isSupabaseConfigured } from "@/lib/env";

export default function SignUpPage() {
  if (isAuthDisabled()) {
    redirect("/");
  }
  return <AuthForm mode="sign-up" configured={isSupabaseConfigured()} />;
}
