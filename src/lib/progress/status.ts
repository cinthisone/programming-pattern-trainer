export type ProblemProgressStatus =
  | "not_started"
  | "attempted"
  | "completed"
  | "mastered";

export function computeProblemProgress(input: {
  implementedLanguageIds: string[];
  passingSubmitLanguageIds: string[];
  hasAttempt: boolean;
}): ProblemProgressStatus {
  const implemented = new Set(input.implementedLanguageIds);
  const passing = new Set(
    input.passingSubmitLanguageIds.filter((id) => implemented.has(id)),
  );

  if (implemented.size > 0 && passing.size === implemented.size) {
    return "mastered";
  }

  if (passing.size > 0) {
    return "completed";
  }

  if (input.hasAttempt) {
    return "attempted";
  }

  return "not_started";
}

export function computeConceptProgress(input: {
  publishedProblemCount: number;
  completedProblemCount: number;
}): { completed: number; published: number; label: string } {
  const published = Math.max(input.publishedProblemCount, 0);
  const completed = Math.min(Math.max(input.completedProblemCount, 0), published);
  return {
    completed,
    published,
    label: `${completed} / ${published}`,
  };
}
