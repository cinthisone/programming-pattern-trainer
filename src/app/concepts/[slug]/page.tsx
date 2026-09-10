import Link from "next/link";
import { notFound } from "next/navigation";
import { listPublishedProblems } from "@/lib/curriculum/catalog";

export default async function ConceptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const problems = listPublishedProblems().filter(
    (problem) => problem.concept.slug === slug,
  );
  const concept = problems[0]?.concept;

  if (!concept) {
    notFound();
  }

  const trackLabel = problems[0].track === "basics" ? "Basics" : "Patterns";

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <p className="font-mono text-xs text-muted-foreground">
        {trackLabel} / {concept.category}
      </p>
      <h1 className="mt-2 text-lg font-semibold tracking-tight">{concept.name}</h1>
      <ul className="mt-6 divide-y divide-border border-y border-border">
        {problems.map((problem) => (
          <li key={problem.id} className="py-3">
            <Link href={`/problems/${problem.slug}`} className="text-sm hover:underline">
              {problem.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
