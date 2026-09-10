import { LANGUAGE_SEED } from "@/lib/languages/seed";
import { enabledLanguages, requireLanguageBySlug } from "@/lib/languages/lookup";
import { LOCAL_PROBLEMS } from "@/lib/curriculum/local-seed";
import type { CurriculumTrack, ResolvedProblem } from "@/lib/curriculum/types";

export function listPublishedProblems(filters?: {
  language?: string;
  track?: CurriculumTrack;
}): ResolvedProblem[] {
  const enabled = enabledLanguages(LANGUAGE_SEED);
  const enabledSlugs = new Set(enabled.map((language) => language.slug));

  return LOCAL_PROBLEMS.map((problem) => resolveProblem(problem, enabledSlugs))
    .filter((problem) => {
      if (filters?.track && problem.track !== filters.track) {
        return false;
      }
      if (!filters?.language) {
        return problem.languages.length > 0;
      }
      return problem.languages.some(
        (implementation) => implementation.languageSlug === filters.language,
      );
    })
    .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

export function getPublishedProblem(slug: string): ResolvedProblem | undefined {
  return listPublishedProblems().find((problem) => problem.slug === slug);
}

function resolveProblem(
  problem: (typeof LOCAL_PROBLEMS)[number],
  enabledSlugs: Set<string>,
): ResolvedProblem {
  const languages = problem.implementations
    .filter((implementation) => enabledSlugs.has(implementation.languageSlug))
    .map((implementation) => ({
      ...implementation,
      language: requireLanguageBySlug(LANGUAGE_SEED, implementation.languageSlug),
    }))
    .sort((a, b) => a.language.sortOrder - b.language.sortOrder);

  return { ...problem, languages };
}
