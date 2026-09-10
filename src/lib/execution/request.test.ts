import { describe, expect, it } from "vitest";
import { LANGUAGE_SEED } from "@/lib/languages/seed";
import { requireLanguageBySlug } from "@/lib/languages/lookup";
import { buildExecutionRequest, ExecutionRequestError } from "@/lib/execution/request";

const python = requireLanguageBySlug(LANGUAGE_SEED, "python");

describe("buildExecutionRequest", () => {
  it("uses the language execution id and caps timeout", () => {
    const request = buildExecutionRequest({
      language: { ...python, defaultTimeoutMs: 20_000 },
      source: "print(1)",
      stdin: "2",
      maxSourceChars: 1000,
      maxTimeoutMs: 8000,
    });

    expect(request.language.executionLanguageId).toBe("71");
    expect(request.timeoutMs).toBe(8000);
    expect(request.stdin).toBe("2");
  });

  it("rejects empty, oversized, or disabled language source", () => {
    expect(() =>
      buildExecutionRequest({
        language: python,
        source: "",
        stdin: "",
        maxSourceChars: 100,
        maxTimeoutMs: 8000,
      }),
    ).toThrow(ExecutionRequestError);

    expect(() =>
      buildExecutionRequest({
        language: python,
        source: "x".repeat(101),
        stdin: "",
        maxSourceChars: 100,
        maxTimeoutMs: 8000,
      }),
    ).toThrow(/size limit/);

    expect(() =>
      buildExecutionRequest({
        language: { ...python, enabled: false },
        source: "print(1)",
        stdin: "",
        maxSourceChars: 100,
        maxTimeoutMs: 8000,
      }),
    ).toThrow(/disabled/);
  });
});
