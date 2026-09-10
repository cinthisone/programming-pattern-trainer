import type { ProblemImplementation } from "@/lib/curriculum/types";

const ORDER = ["python", "javascript", "typescript", "c", "go", "php"] as const;

export function implementations(
  bySlug: Record<(typeof ORDER)[number], Omit<ProblemImplementation, "languageSlug">>,
): ProblemImplementation[] {
  return ORDER.map((languageSlug) => ({
    languageSlug,
    ...bySlug[languageSlug],
  }));
}
