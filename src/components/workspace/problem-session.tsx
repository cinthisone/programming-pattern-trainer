"use client";

import { useState } from "react";
import { ProblemPane } from "@/components/workspace/problem-pane";
import { ProblemWorkspace } from "@/components/workspace/problem-workspace";
import type { ResolvedProblem } from "@/lib/curriculum/types";

export function ProblemSession({
  problem,
  initialLanguageSlug,
}: {
  problem: ResolvedProblem;
  initialLanguageSlug: string;
}) {
  const [languageSlug, setLanguageSlug] = useState(initialLanguageSlug);

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 md:h-full md:grid-cols-[minmax(18rem,36%)_minmax(0,1fr)] md:overflow-hidden">
      <ProblemPane problem={problem} languageSlug={languageSlug} />
      <div className="min-h-[28rem] md:min-h-0 md:h-full">
        <ProblemWorkspace
          problem={problem}
          languageSlug={languageSlug}
          onLanguageChange={setLanguageSlug}
        />
      </div>
    </div>
  );
}
