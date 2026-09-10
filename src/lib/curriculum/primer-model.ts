import type { PrimerTopicSlug } from "@/lib/curriculum/tracks";

export interface TopicIdea {
  title: string;
  idea: string;
  points: string[];
}

export interface LanguageKeyword {
  name: string;
  use: string;
  /** False for real language features that modern apps should not use. */
  modern?: boolean;
  whyNotModern?: string;
}

export interface PrimerSection {
  heading: string;
  body: string;
  example?: string;
}

export interface LanguageSyntax {
  how: string;
  example: string;
  keywords?: LanguageKeyword[];
  sections?: PrimerSection[];
  watch: string[];
}

export interface ResolvedPrimer extends TopicIdea, LanguageSyntax {
  topicSlug: PrimerTopicSlug;
}

export type LanguagePrimers = Record<string, LanguageSyntax>;
