import Link from "next/link";

const sections = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/concepts", label: "Concepts" },
  { href: "/admin/problems", label: "Problems" },
  { href: "/admin/languages", label: "Languages" },
  { href: "/admin/generate", label: "AI Generator" },
  { href: "/admin/drafts", label: "Drafts" },
  { href: "/admin/review", label: "Review queue" },
];

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="text-lg font-semibold tracking-tight">Admin</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Authorization is enforced on the server. These screens are gated even if
        a client hides the links.
      </p>
      <ul className="mt-6 grid gap-2 text-sm">
        {sections.map((section) => (
          <li key={section.href}>
            <Link className="underline-offset-4 hover:underline" href={section.href}>
              {section.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
