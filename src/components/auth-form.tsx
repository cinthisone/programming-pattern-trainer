"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthForm({
  mode,
  configured,
}: {
  mode: "sign-in" | "sign-up";
  configured: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onPasswordSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!configured) {
      setError("Supabase is not configured. Add keys to .env.local.");
      return;
    }

    setPending(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createBrowserSupabaseClient();
      if (mode === "sign-up") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) {
          throw signUpError;
        }
        setMessage("Check your email to confirm the account, then sign in.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          throw signInError;
        }
        router.push("/dashboard");
        router.refresh();
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Authentication failed");
    } finally {
      setPending(false);
    }
  }

  async function onMagicLink() {
    if (!configured) {
      setError("Supabase is not configured. Add keys to .env.local.");
      return;
    }
    if (!email) {
      setError("Enter an email address for a magic link.");
      return;
    }

    setPending(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createBrowserSupabaseClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (otpError) {
        throw otpError;
      }
      setMessage("Magic link sent. Check your email.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not send magic link");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-16">
      <h1 className="text-lg font-semibold tracking-tight">
        {mode === "sign-in" ? "Sign in" : "Create an account"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Email and password, or a magic link. No OAuth in MVP.
      </p>
      <form className="mt-6 grid gap-4" onSubmit={onPasswordSubmit}>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        <Button type="submit" disabled={pending}>
          {mode === "sign-in" ? "Sign in" : "Sign up"}
        </Button>
        <Button type="button" variant="outline" disabled={pending} onClick={onMagicLink}>
          Send magic link
        </Button>
      </form>
      <p className="mt-4 text-sm text-muted-foreground">
        {mode === "sign-in" ? (
          <>
            No account?{" "}
            <Link className="text-foreground underline-offset-4 hover:underline" href="/auth/sign-up">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already registered?{" "}
            <Link className="text-foreground underline-offset-4 hover:underline" href="/auth/sign-in">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
