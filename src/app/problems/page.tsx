import { ProblemList } from "@/components/catalog/problem-list";
import { TrackTabs } from "@/components/catalog/track-tabs";
import { listPublishedProblems } from "@/lib/curriculum/catalog";

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    language?: string;
    difficulty?: string;
  }>;
}) {
  const filters = await searchParams;
  const problems = listPublishedProblems({
    language: filters.language,
    track: "patterns",
  }).filter((problem) => {
    if (filters.difficulty && problem.difficulty !== filters.difficulty) {
      return false;
    }
    if (!filters.q) {
      return true;
    }
    const q = filters.q.toLowerCase();
    return (
      problem.title.toLowerCase().includes(q) ||
      problem.concept.name.toLowerCase().includes(q)
    );
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <TrackTabs current="patterns" />
      <h1 className="mt-6 text-lg font-semibold tracking-tight">Patterns</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Reusable problem-solving patterns. One problem, many languages.
      </p>
      <ProblemList problems={problems} />
    </main>
  );
}
