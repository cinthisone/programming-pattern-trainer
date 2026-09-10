import Link from "next/link";
import { LANGUAGE_SEED } from "@/lib/languages/seed";
import { enabledLanguages } from "@/lib/languages/lookup";
import { isAuthDisabled } from "@/lib/env";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const languages = enabledLanguages(LANGUAGE_SEED);
  const authDisabled = isAuthDisabled();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-16">
      <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
        Basics → Pattern → Implementation
      </p>
      <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance">
        Learn the idea once. Write it in every language.
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
        Start with variables, loops, arrays, and sets. Then learn named patterns.
        Problems are language-independent. You supply the syntax.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/basics">Start with basics</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/problems">Browse patterns</Link>
        </Button>
        {authDisabled ? null : (
          <Button asChild variant="outline">
            <Link href="/auth/sign-up">Create an account</Link>
          </Button>
        )}
      </div>
      <ul className="mt-10 flex flex-wrap gap-2 font-mono text-xs text-muted-foreground">
        {languages.map((language) => (
          <li
            key={language.slug}
            className="rounded-md border border-border px-2 py-1"
          >
            {language.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
