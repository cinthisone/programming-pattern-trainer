import { describe, expect, it } from "vitest";
import { getPrimer } from "@/lib/curriculum/primers";
import { BASICS_TOPICS } from "@/lib/curriculum/tracks";
import { MVP_LANGUAGE_SLUGS } from "@/lib/languages/seed";

describe("concept primers", () => {
  it("teaches variables in the selected language", () => {
    const python = getPrimer("variables", "python");
    const go = getPrimer("variables", "go");
    expect(python?.title).toBe("Variables");
    expect(python?.example).toContain("n = 7");
    expect(go?.example).toContain(":=");
    expect(go?.how).not.toBe(python?.how);
  });

  it("teaches var, let, and const for JavaScript variables", () => {
    const primer = getPrimer("variables", "javascript");
    const names = primer?.keywords?.map((keyword) => keyword.name);
    expect(names).toEqual(["var", "let", "const"]);
    expect(primer?.keywords?.[0]?.modern).toBe(false);
    expect(primer?.keywords?.[0]?.whyNotModern).toMatch(/leaks/i);
    expect(primer?.sections?.map((section) => section.heading)).toEqual([
      "Execution context",
      "Scope",
      "Hoisting",
      "Temporal dead zone",
      "Why var is not recommended for modern apps",
    ]);
  });

  it("covers every basics topic in every MVP language", () => {
    const topics = BASICS_TOPICS.filter((topic) => topic.slug !== "all");
    for (const topic of topics) {
      if (!topic.conceptSlugs) {
        continue;
      }
      const conceptSlug = topic.conceptSlugs[0];
      for (const languageSlug of MVP_LANGUAGE_SLUGS) {
        const primer = getPrimer(conceptSlug, languageSlug);
        expect(primer, `${topic.slug} / ${languageSlug}`).toBeDefined();
        expect(primer?.example.length).toBeGreaterThan(10);
        expect(
          primer?.sections?.length,
          `${topic.slug} / ${languageSlug} sections`,
        ).toBeGreaterThanOrEqual(3);
        expect(primer?.how.length).toBeGreaterThan(80);
      }
    }
  });

  it("has no primer for named patterns", () => {
    expect(getPrimer("accumulator", "python")).toBeUndefined();
  });
});
