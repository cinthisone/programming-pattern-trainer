import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { ResolvedProblem } from "@/lib/curriculum/types";

export function ProblemList({ problems }: { problems: ResolvedProblem[] }) {
  if (problems.length === 0) {
    return (
      <p className="mt-6 text-sm text-muted-foreground">No problems in this section yet.</p>
    );
  }

  return (
    <ul className="mt-6 divide-y divide-border border-y border-border">
      {problems.map((problem) => (
        <li key={problem.id}>
          <Link
            href={`/problems/${problem.slug}`}
            className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-medium">{problem.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {problem.concept.name}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{problem.difficulty}</Badge>
              <p className="font-mono text-[11px] text-muted-foreground">
                {problem.languages.map((item) => item.language.name).join(" · ")}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
