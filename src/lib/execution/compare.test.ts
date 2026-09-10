import { describe, expect, it } from "vitest";
import { outputsMatch } from "@/lib/execution/compare";

describe("outputsMatch", () => {
  it("treats trailing whitespace and extra final newlines as equal", () => {
    expect(outputsMatch("3\n", "3")).toBe(true);
    expect(outputsMatch("3 \n4\t\n", "3\n4")).toBe(true);
  });

  it("does not fuzzy-match different values", () => {
    expect(outputsMatch("3", "4")).toBe(false);
    expect(outputsMatch("hello", "Hello")).toBe(false);
  });

  it("normalizes CRLF", () => {
    expect(outputsMatch("a\r\nb\r\n", "a\nb")).toBe(true);
  });
});
