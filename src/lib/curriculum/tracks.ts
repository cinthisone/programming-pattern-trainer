import type { CurriculumTrack } from "@/lib/curriculum/types";

export const BASICS_TOPICS = [
  {
    slug: "all",
    label: "All",
    conceptSlugs: null,
  },
  {
    slug: "variables",
    label: "Variables",
    conceptSlugs: ["variables", "operators"],
  },
  {
    slug: "control-structures",
    label: "Control structures",
    conceptSlugs: ["control-structures"],
  },
  {
    slug: "loops",
    label: "Loops",
    conceptSlugs: ["loops"],
  },
  {
    slug: "arrays",
    label: "Arrays",
    conceptSlugs: ["arrays"],
  },
  {
    slug: "sets",
    label: "Sets",
    conceptSlugs: ["sets"],
  },
] as const;

export type BasicsTopicSlug = (typeof BASICS_TOPICS)[number]["slug"];

export type PrimerTopicSlug = Exclude<BasicsTopicSlug, "all">;

export function primerTopicForConcept(conceptSlug: string): PrimerTopicSlug | null {
  for (const topic of BASICS_TOPICS) {
    if (topic.slug === "all" || topic.conceptSlugs === null) {
      continue;
    }
    if ((topic.conceptSlugs as readonly string[]).includes(conceptSlug)) {
      return topic.slug;
    }
  }
  return null;
}

export function isCurriculumTrack(value: string | undefined): value is CurriculumTrack {
  return value === "basics" || value === "patterns";
}

export function isBasicsTopicSlug(value: string | undefined): value is BasicsTopicSlug {
  return BASICS_TOPICS.some((topic) => topic.slug === value);
}

export function matchesBasicsTopic(
  problem: { concept: { slug: string } },
  topicSlug: BasicsTopicSlug,
): boolean {
  const topic = BASICS_TOPICS.find((item) => item.slug === topicSlug);
  if (!topic || topic.conceptSlugs === null) {
    return true;
  }
  return (topic.conceptSlugs as readonly string[]).includes(problem.concept.slug);
}
