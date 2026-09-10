import {
  primerTopicForConcept,
  type PrimerTopicSlug,
} from "@/lib/curriculum/tracks";
import type {
  LanguageSyntax,
  ResolvedPrimer,
  TopicIdea,
} from "@/lib/curriculum/primer-model";
import { ARRAYS } from "@/lib/curriculum/primers/arrays";
import { CONTROL_STRUCTURES } from "@/lib/curriculum/primers/control-structures";
import { LOOPS } from "@/lib/curriculum/primers/loops";
import { SETS } from "@/lib/curriculum/primers/sets";
import { VARIABLES } from "@/lib/curriculum/primers/variables";

export type {
  LanguageKeyword,
  LanguageSyntax,
  PrimerSection,
  ResolvedPrimer,
  TopicIdea,
} from "@/lib/curriculum/primer-model";

const TOPIC_IDEAS: Record<PrimerTopicSlug, TopicIdea> = {
  variables: {
    title: "Variables",
    idea:
      "A variable is a name for a value in memory. You assign once, then use the name instead of repeating the value. Operators combine those values.",
    points: [
      "Give the value a name (assignment).",
      "Read it later by that name.",
      "Use operators such as + and % to compute from named values.",
    ],
  },
  "control-structures": {
    title: "Control structures",
    idea:
      "A control structure chooses a path. if / else asks a yes-or-no question, then runs one block and skips the other.",
    points: [
      "The condition must be true or false.",
      "Only one branch runs.",
      "else covers every case the if did not.",
    ],
  },
  loops: {
    title: "Loops",
    idea:
      "A loop repeats the same work with a changing counter. Counted loops go from a start to an end, then stop.",
    points: [
      "Initialize a counter.",
      "Repeat while the counter is in range.",
      "Change the counter each pass so the loop can end.",
    ],
  },
  arrays: {
    title: "Arrays",
    idea:
      "An array is an ordered list. The first item is at index 0. The last item is at index n - 1.",
    points: [
      "Store many values under one name.",
      "Index from 0.",
      "Walk the list with a loop when you need every element.",
    ],
  },
  sets: {
    title: "Sets",
    idea:
      "A set stores each value once. Membership answers “have I seen this before?” without counting duplicates.",
    points: [
      "Insert a value; duplicates collapse.",
      "The size of the set is the number of distinct values.",
      "Some languages use a real Set; others fake one with a map or flags.",
    ],
  },
};

const LANGUAGE_SYNTAX: Record<PrimerTopicSlug, Record<string, LanguageSyntax>> = {
  variables: VARIABLES,
  "control-structures": CONTROL_STRUCTURES,
  loops: LOOPS,
  arrays: ARRAYS,
  sets: SETS,
};

export function getPrimer(
  conceptSlug: string,
  languageSlug: string,
): ResolvedPrimer | undefined {
  const topicSlug = primerTopicForConcept(conceptSlug);
  if (!topicSlug) {
    return undefined;
  }
  const idea = TOPIC_IDEAS[topicSlug];
  const syntax = LANGUAGE_SYNTAX[topicSlug][languageSlug];
  if (!idea || !syntax) {
    return undefined;
  }
  return { topicSlug, ...idea, ...syntax };
}
