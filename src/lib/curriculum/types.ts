import type { ProgrammingLanguage } from "@/lib/languages/types";

export type Difficulty = "easy" | "medium" | "hard";

export type CurriculumTrack = "basics" | "patterns";

export interface ProblemHint {
  hintLevel: number;
  content: string;
}

export interface ProblemTestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface ProblemImplementation {
  languageSlug: string;
  starterCode: string;
  solutionCode: string;
  functionSignature: string;
  explanation: string;
}

export interface CatalogProblem {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  instructions: string;
  constraints: string;
  exampleInput: string;
  exampleOutput: string;
  timeComplexity: string;
  spaceComplexity: string;
  concept: {
    slug: string;
    name: string;
    category: string;
  };
  track: CurriculumTrack;
  sortOrder: number;
  hints: ProblemHint[];
  tests: ProblemTestCase[];
  implementations: ProblemImplementation[];
}

export interface ResolvedImplementation extends ProblemImplementation {
  language: ProgrammingLanguage;
}

export interface ResolvedProblem extends CatalogProblem {
  languages: ResolvedImplementation[];
}
