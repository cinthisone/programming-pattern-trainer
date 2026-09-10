export function AdminPlaceholder({ title }: { title: string }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This section is reserved for the curriculum workflow. Publishing is
        never automatic.
      </p>
    </main>
  );
}
