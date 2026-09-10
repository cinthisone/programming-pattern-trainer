import { describe, expect, it } from "vitest";
import {
  assertGeneratedProblemLanguages,
  generatedProblemSchema,
} from "@/lib/validation/generated-problem";

const validProblem = {
  title: "Running Sum",
  slug: "running-sum",
  description: "Return a running sum of the array.",
  difficulty: "easy" as const,
  instructions: "Read n then n integers. Print the running sum.",
  constraints: "1 <= n <= 1000",
  exampleInput: "3\n1 2 3",
  exampleOutput: "1 3 6",
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  hints: [
    { hintLevel: 1, content: "Think accumulators." },
    { hintLevel: 2, content: "This is a prefix-sum pattern." },
    { hintLevel: 3, content: "Keep a running total while traversing." },
    { hintLevel: 4, content: "total = 0; for x in arr: total += x" },
  ],
  tests: [
    { input: "3\n1 2 3", expectedOutput: "1 3 6", isHidden: false },
    { input: "1\n9", expectedOutput: "9", isHidden: true },
  ],
  implementations: [
    {
      languageSlug: "python",
      starterCode: "print()",
      solutionCode: "print(1)",
      functionSignature: "def solve():",
      explanation: "Accumulate while iterating.",
    },
  ],
};

describe("generatedProblemSchema", () => {
  it("accepts structured AI output", () => {
    expect(generatedProblemSchema.parse(validProblem).slug).toBe("running-sum");
  });

  it("rejects prose-shaped payloads", () => {
    expect(() =>
      generatedProblemSchema.parse({
        ...validProblem,
        difficulty: "tricky",
      }),
    ).toThrow();
  });
});

describe("assertGeneratedProblemLanguages", () => {
  it("requires every requested language and mixed test visibility", () => {
    expect(() =>
      assertGeneratedProblemLanguages(
        generatedProblemSchema.parse(validProblem),
        ["python", "php"],
      ),
    ).toThrow(/Missing language implementations: php/);
  });
});
