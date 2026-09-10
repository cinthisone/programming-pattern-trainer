import { describe, expect, it } from "vitest";
import { LANGUAGE_SEED, MVP_LANGUAGE_SLUGS } from "@/lib/languages/seed";
import {
  enabledLanguages,
  findLanguageBySlug,
  requireEnabledLanguageBySlug,
  requireLanguageBySlug,
} from "@/lib/languages/lookup";

describe("language seed", () => {
  it("includes the six MVP languages, all enabled", () => {
    expect([...MVP_LANGUAGE_SLUGS].sort()).toEqual([
      "c",
      "go",
      "javascript",
      "php",
      "python",
      "typescript",
    ]);
    expect(LANGUAGE_SEED.every((language) => language.enabled)).toBe(true);
  });

  it("maps Monaco and execution ids without per-language branches in callers", () => {
    const go = requireLanguageBySlug(LANGUAGE_SEED, "go");
    const php = requireLanguageBySlug(LANGUAGE_SEED, "php");
    expect(go.monacoLanguage).toBe("go");
    expect(go.fileExtension).toBe(".go");
    expect(php.monacoLanguage).toBe("php");
    expect(php.fileExtension).toBe(".php");
    expect(go.executionLanguageId).toMatch(/^\d+$/);
    expect(php.executionLanguageId).toMatch(/^\d+$/);
  });
});

describe("language lookup", () => {
  it("returns enabled languages in sort order", () => {
    const slugs = enabledLanguages(LANGUAGE_SEED).map((language) => language.slug);
    expect(slugs).toEqual([
      "python",
      "javascript",
      "typescript",
      "c",
      "go",
      "php",
    ]);
  });

  it("fails closed on unknown slugs", () => {
    expect(findLanguageBySlug(LANGUAGE_SEED, "cobol")).toBeUndefined();
    expect(() => requireLanguageBySlug(LANGUAGE_SEED, "cobol")).toThrow(
      /Unknown language slug/,
    );
  });

  it("fails closed on disabled languages when required for execution", () => {
    const disabled = LANGUAGE_SEED.map((language) =>
      language.slug === "php" ? { ...language, enabled: false } : language,
    );
    expect(() => requireEnabledLanguageBySlug(disabled, "php")).toThrow(
      /Language is disabled/,
    );
  });
});
