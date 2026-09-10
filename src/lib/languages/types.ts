export interface ProgrammingLanguage {
  id: string;
  slug: string;
  name: string;
  monacoLanguage: string;
  executionLanguageId: string;
  fileExtension: string;
  enabled: boolean;
  sortOrder: number;
  defaultTimeoutMs: number;
}

export type LanguageSlug = ProgrammingLanguage["slug"];
