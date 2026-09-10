import { describe, expect, it } from "vitest";
import { getPublishedProblem, listPublishedProblems } from "@/lib/curriculum/catalog";
import { MVP_LANGUAGE_SLUGS } from "@/lib/languages/seed";

describe("local catalog", () => {
  it("publishes running-total with every MVP language", () => {
    const problem = getPublishedProblem("running-total");
    expect(problem).toBeDefined();
    expect(problem?.track).toBe("patterns");
    const slugs = problem?.languages.map((item) => item.languageSlug);
    expect(slugs).toEqual(MVP_LANGUAGE_SLUGS);
  });

  it("publishes basics before named patterns", () => {
    const slugs = listPublishedProblems().map((problem) => problem.slug);
    expect(slugs[0]).toBe("read-a-number");
    expect(slugs.at(-1)).toBe("running-total");
  });

  it("splits basics from patterns", () => {
    expect(listPublishedProblems({ track: "patterns" }).map((problem) => problem.slug)).toEqual([
      "running-total",
    ]);
    const basics = listPublishedProblems({ track: "basics" }).map((problem) => problem.slug);
    expect(basics).toEqual([
      "read-a-number",
      "add-two-numbers",
      "even-or-odd",
      "count-to-n",
      "sum-of-a-list",
      "first-and-last",
      "count-uniques",
    ]);
    expect(basics).not.toContain("running-total");
  });

  it("implements every basic in every MVP language", () => {
    for (const problem of listPublishedProblems({ track: "basics" })) {
      expect(problem.languages.map((item) => item.languageSlug)).toEqual(MVP_LANGUAGE_SLUGS);
    }
  });

  it("filters by language without client-side catalog dumps", () => {
    const phpOnly = listPublishedProblems({ language: "php", track: "patterns" });
    expect(phpOnly.map((problem) => problem.slug)).toEqual(["running-total"]);
    expect(listPublishedProblems({ language: "cobol" })).toEqual([]);
  });

  it("fails closed on unknown slugs", () => {
    expect(getPublishedProblem("does-not-exist")).toBeUndefined();
  });
});
