import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { getCurrentUser } from "@/lib/auth/user";
import { isCurrentUserAdmin } from "@/lib/auth/admin";
import { isAuthDisabled } from "@/lib/env";
import { SignOutButton } from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/basics", label: "Basics" },
  { href: "/problems", label: "Patterns" },
  { href: "/concepts", label: "Concepts" },
  { href: "/dashboard", label: "Dashboard" },
];

export async function SiteHeader() {
  const authDisabled = isAuthDisabled();
  const user = await getCurrentUser();
  const isAdmin = user ? await isCurrentUserAdmin() : false;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-12 w-full max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="flex items-baseline gap-2 font-medium tracking-tight">
          <span className="font-mono text-[11px] text-muted-foreground">PT</span>
          <span className="text-sm">Pattern Trainer</span>
        </Link>
        <nav className="flex min-w-0 flex-1 items-center gap-4 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          {isAdmin ? (
            <Link
              href="/admin"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Admin
            </Link>
          ) : null}
        </nav>
        <div className="flex items-center gap-2">
          {authDisabled ? (
            <span className="font-mono text-[11px] text-muted-foreground">Local</span>
          ) : null}
          <ThemeToggle />
          {authDisabled ? null : user ? (
            <SignOutButton />
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/sign-in">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
