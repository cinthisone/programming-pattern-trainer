import Link from "next/link";
import { listPublishedProblems } from "@/lib/curriculum/catalog";
import type { CurriculumTrack } from "@/lib/curriculum/types";

const TRACK_COPY: Record<CurriculumTrack, { title: string; description: string }> = {
  basics: {
    title: "Basics",
    description: "Variables, control structures, loops, arrays, and sets.",
  },
  patterns: {
    title: "Patterns",
    description: "Named problem-solving patterns you reuse across languages.",
  },
};

export default function ConceptsPage() {
  const problems = listPublishedProblems();
  const tracks: CurriculumTrack[] = ["basics", "patterns"];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="text-lg font-semibold tracking-tight">Concepts</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Concepts come from curriculum data. Basics first, then named patterns.
      </p>
      {tracks.map((track) => {
        const concepts = [
          ...new Map(
            problems
              .filter((problem) => problem.track === track)
              .map((problem) => [problem.concept.slug, problem.concept]),
          ).values(),
        ];
        if (concepts.length === 0) {
          return null;
        }
        return (
          <section key={track} className="mt-8">
            <h2 className="text-sm font-medium tracking-tight">
              {TRACK_COPY[track].title}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {TRACK_COPY[track].description}
            </p>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {concepts.map((concept) => (
                <li key={concept.slug} className="py-3">
                  <Link
                    href={`/concepts/${concept.slug}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {concept.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">{concept.category}</p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
