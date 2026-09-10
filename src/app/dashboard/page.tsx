import { getCurrentUser } from "@/lib/auth/user";
import { isAuthDisabled } from "@/lib/env";

export default async function DashboardPage() {
  const authDisabled = isAuthDisabled();
  const user = await getCurrentUser();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
      {authDisabled ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Auth is off. Progress will not persist until a database is connected.
          You can keep building the rest of the app locally.
        </p>
      ) : user ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Signed in as {user.email ?? user.id}. Attempt counts, streaks, and
          language progress will appear here after submissions exist.
        </p>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to track attempts and completed problems.
        </p>
      )}
    </main>
  );
}
