import type { ProgrammingLanguage } from "@/lib/languages/types";

/**
 * Judge0 CE language ids must match the deployed Judge0 version.
 * These are the widely available Community Edition ids:
 * Python 3.8.1 = 71, Node 12.14.0 = 63, TypeScript 3.7.4 = 74,
 * C GCC 9.2.0 = 50, Go 1.13.5 = 60, PHP 7.4.1 = 68.
 */
export const LANGUAGE_SEED: ProgrammingLanguage[] = [
  {
    id: "seed-python",
    slug: "python",
    name: "Python",
    monacoLanguage: "python",
    executionLanguageId: "71",
    fileExtension: ".py",
    enabled: true,
    sortOrder: 10,
    defaultTimeoutMs: 5000,
  },
  {
    id: "seed-javascript",
    slug: "javascript",
    name: "JavaScript",
    monacoLanguage: "javascript",
    executionLanguageId: "63",
    fileExtension: ".js",
    enabled: true,
    sortOrder: 20,
    defaultTimeoutMs: 5000,
  },
  {
    id: "seed-typescript",
    slug: "typescript",
    name: "TypeScript",
    monacoLanguage: "typescript",
    executionLanguageId: "74",
    fileExtension: ".ts",
    enabled: true,
    sortOrder: 30,
    defaultTimeoutMs: 5000,
  },
  {
    id: "seed-c",
    slug: "c",
    name: "C",
    monacoLanguage: "c",
    executionLanguageId: "50",
    fileExtension: ".c",
    enabled: true,
    sortOrder: 40,
    defaultTimeoutMs: 5000,
  },
  {
    id: "seed-go",
    slug: "go",
    name: "Go",
    monacoLanguage: "go",
    executionLanguageId: "60",
    fileExtension: ".go",
    enabled: true,
    sortOrder: 50,
    defaultTimeoutMs: 5000,
  },
  {
    id: "seed-php",
    slug: "php",
    name: "PHP",
    monacoLanguage: "php",
    executionLanguageId: "68",
    fileExtension: ".php",
    enabled: true,
    sortOrder: 60,
    defaultTimeoutMs: 5000,
  },
];

export const MVP_LANGUAGE_SLUGS = LANGUAGE_SEED.map((language) => language.slug);
