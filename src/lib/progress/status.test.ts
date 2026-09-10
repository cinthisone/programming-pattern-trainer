import { describe, expect, it } from "vitest";
import { computeConceptProgress, computeProblemProgress } from "@/lib/progress/status";

describe("computeProblemProgress", () => {
  const implemented = ["py", "js", "go"];

  it("is not_started with no attempts", () => {
    expect(
      computeProblemProgress({
        implementedLanguageIds: implemented,
        passingSubmitLanguageIds: [],
        hasAttempt: false,
      }),
    ).toBe("not_started");
  });

  it("is attempted when work exists but nothing passed", () => {
    expect(
      computeProblemProgress({
        implementedLanguageIds: implemented,
        passingSubmitLanguageIds: [],
        hasAttempt: true,
      }),
    ).toBe("attempted");
  });

  it("is completed after one passing language", () => {
    expect(
      computeProblemProgress({
        implementedLanguageIds: implemented,
        passingSubmitLanguageIds: ["py"],
        hasAttempt: true,
      }),
    ).toBe("completed");
  });

  it("is mastered only after every implemented language passes", () => {
    expect(
      computeProblemProgress({
        implementedLanguageIds: implemented,
        passingSubmitLanguageIds: ["py", "js", "go"],
        hasAttempt: true,
      }),
    ).toBe("mastered");
  });

  it("ignores passing submits for languages that do not implement the problem", () => {
    expect(
      computeProblemProgress({
        implementedLanguageIds: ["py"],
        passingSubmitLanguageIds: ["py", "php"],
        hasAttempt: true,
      }),
    ).toBe("mastered");
  });
});

describe("computeConceptProgress", () => {
  it("renders an explicit ratio, not a percentage", () => {
    expect(
      computeConceptProgress({
        publishedProblemCount: 8,
        completedProblemCount: 3,
      }),
    ).toEqual({ completed: 3, published: 8, label: "3 / 8" });
  });
});
