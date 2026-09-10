import { describe, expect, it } from "vitest";
import { executionApiRequestSchema } from "@/lib/validation/execution";

describe("executionApiRequestSchema", () => {
  it("accepts a valid run payload", () => {
    const parsed = executionApiRequestSchema.parse({
      problemSlug: "two-sum-ii",
      languageSlug: "php",
      source: "<?php echo 1;",
      mode: "run",
    });
    expect(parsed.languageSlug).toBe("php");
  });

  it("accepts a custom stdin try payload", () => {
    const parsed = executionApiRequestSchema.parse({
      problemSlug: "read-a-number",
      languageSlug: "python",
      source: "print(1)",
      mode: "try",
      stdin: "42",
    });
    expect(parsed.mode).toBe("try");
    expect(parsed.stdin).toBe("42");
  });

  it("rejects missing source and invalid mode", () => {
    expect(() =>
      executionApiRequestSchema.parse({
        problemSlug: "two-sum-ii",
        languageSlug: "go",
        source: "",
        mode: "run",
      }),
    ).toThrow();

    expect(() =>
      executionApiRequestSchema.parse({
        problemSlug: "two-sum-ii",
        languageSlug: "go",
        source: "package main",
        mode: "debug",
      }),
    ).toThrow();
  });
});
