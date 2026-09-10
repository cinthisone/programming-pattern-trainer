import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-16">
      <p className="font-mono text-xs text-muted-foreground">404</p>
      <h1 className="mt-2 text-lg font-semibold tracking-tight">Not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        That page does not exist, or you do not have access to it.
      </p>
      <Link className="mt-6 text-sm underline-offset-4 hover:underline" href="/">
        Back to home
      </Link>
    </main>
  );
}
