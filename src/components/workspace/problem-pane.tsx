import { Badge } from "@/components/ui/badge";
import { HintList } from "@/components/workspace/hint-list";
import { ConceptHelpButton } from "@/components/workspace/concept-help";
import type { ResolvedProblem } from "@/lib/curriculum/types";

export function ProblemPane({
  problem,
  languageSlug,
}: {
  problem: ResolvedProblem;
  languageSlug: string;
}) {
  const language =
    problem.languages.find((item) => item.languageSlug === languageSlug) ??
    problem.languages[0];
  const visibleTests = problem.tests.filter((test) => !test.isHidden);
  const hiddenCount = problem.tests.length - visibleTests.length;

  return (
    <aside className="min-h-0 overflow-y-auto border-b border-border p-4 md:border-r md:border-b-0">
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-[11px] text-muted-foreground">
          {problem.track === "basics" ? "Basics" : "Patterns"} / {problem.concept.category} /{" "}
          {problem.concept.name}
        </p>
        {language ? (
          <ConceptHelpButton
            conceptSlug={problem.concept.slug}
            languageSlug={language.languageSlug}
            languageName={language.language.name}
          />
        ) : null}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <h1 className="text-base font-semibold tracking-tight">{problem.title}</h1>
        <Badge variant="secondary">{problem.difficulty}</Badge>
      </div>
      <p className="mt-3 text-sm leading-6">{problem.description}</p>
      <section className="mt-6">
        <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Instructions
        </h2>
        <p className="mt-2 text-sm leading-6">{problem.instructions}</p>
      </section>
      <section className="mt-6">
        <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Visible tests
        </h2>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          These values are stored with the problem. Run tests sends each stdin into your
          program and checks stdout. Type your own numbers in Your stdin and click Try.
        </p>
        <ol className="mt-2 space-y-2">
          {visibleTests.map((test, index) => (
            <li
              key={`${test.input}-${index}`}
              className="rounded-md border border-border bg-muted/40 p-3 font-mono text-xs leading-5"
            >
              <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
                Test {index + 1}
              </p>
              <p className="mt-1">
                <span className="text-muted-foreground">stdin</span> {test.input || "∅"}
              </p>
              <p>
                <span className="text-muted-foreground">stdout</span> {test.expectedOutput || "∅"}
              </p>
            </li>
          ))}
        </ol>
        {hiddenCount > 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Submit also runs {hiddenCount} hidden {hiddenCount === 1 ? "test" : "tests"}{" "}
            (input not shown).
          </p>
        ) : null}
      </section>
      <section className="mt-6">
        <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Constraints
        </h2>
        <p className="mt-2 text-sm leading-6">{problem.constraints}</p>
        <p className="mt-2 font-mono text-[11px] text-muted-foreground">
          {problem.timeComplexity} · {problem.spaceComplexity}
        </p>
      </section>
      <HintList hints={problem.hints} />
    </aside>
  );
}
