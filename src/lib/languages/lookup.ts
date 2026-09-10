import type { ProgrammingLanguage } from "@/lib/languages/types";

export function enabledLanguages(
  languages: ProgrammingLanguage[],
): ProgrammingLanguage[] {
  return languages
    .filter((language) => language.enabled)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

export function findLanguageBySlug(
  languages: ProgrammingLanguage[],
  slug: string,
): ProgrammingLanguage | undefined {
  return languages.find((language) => language.slug === slug);
}

export function findLanguageById(
  languages: ProgrammingLanguage[],
  id: string,
): ProgrammingLanguage | undefined {
  return languages.find((language) => language.id === id);
}

export function requireLanguageBySlug(
  languages: ProgrammingLanguage[],
  slug: string,
): ProgrammingLanguage {
  const language = findLanguageBySlug(languages, slug);
  if (!language) {
    throw new Error(`Unknown language slug: ${slug}`);
  }
  return language;
}

export function requireEnabledLanguageBySlug(
  languages: ProgrammingLanguage[],
  slug: string,
): ProgrammingLanguage {
  const language = requireLanguageBySlug(languages, slug);
  if (!language.enabled) {
    throw new Error(`Language is disabled: ${slug}`);
  }
  return language;
}
