import { z } from "zod";

export const difficultySchema = z.enum(["easy", "medium", "hard"]);
export const hintLevelSchema = z.number().int().min(1).max(5);

export const generatedHintSchema = z.object({
  hintLevel: hintLevelSchema,
  content: z.string().min(1),
});

export const generatedTestCaseSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
  isHidden: z.boolean(),
});

export const generatedImplementationSchema = z.object({
  languageSlug: z.string().min(1),
  starterCode: z.string().min(1),
  solutionCode: z.string().min(1),
  functionSignature: z.string().min(1),
  explanation: z.string().min(1),
});

export const generatedProblemSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(128)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().min(1),
  difficulty: difficultySchema,
  instructions: z.string().min(1),
  constraints: z.string().min(1),
  exampleInput: z.string(),
  exampleOutput: z.string(),
  timeComplexity: z.string().min(1),
  spaceComplexity: z.string().min(1),
  hints: z.array(generatedHintSchema).min(4),
  tests: z.array(generatedTestCaseSchema).min(2),
  implementations: z.array(generatedImplementationSchema).min(1),
});

export type GeneratedProblem = z.infer<typeof generatedProblemSchema>;

export function assertGeneratedProblemLanguages(
  problem: GeneratedProblem,
  requiredLanguageSlugs: string[],
): void {
  const present = new Set(
    problem.implementations.map((implementation) => implementation.languageSlug),
  );
  const missing = requiredLanguageSlugs.filter((slug) => !present.has(slug));
  if (missing.length > 0) {
    throw new Error(`Missing language implementations: ${missing.join(", ")}`);
  }

  const hiddenCount = problem.tests.filter((test) => test.isHidden).length;
  const visibleCount = problem.tests.length - hiddenCount;
  if (visibleCount < 1 || hiddenCount < 1) {
    throw new Error("Generated problems must include visible and hidden tests");
  }
}
