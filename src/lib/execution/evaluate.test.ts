import { describe, expect, it } from "vitest";
import { evaluateCustomInput, evaluateSubmission } from "@/lib/execution/evaluate";
import { LANGUAGE_SEED } from "@/lib/languages/seed";
import { requireLanguageBySlug } from "@/lib/languages/lookup";
import type { CodeExecutionProvider, ExecutionResult } from "@/lib/execution/types";
import type { ProblemTestCase } from "@/lib/curriculum/types";

const python = requireLanguageBySlug(LANGUAGE_SEED, "python");

const tests: ProblemTestCase[] = [
  { input: "7", expectedOutput: "7", isHidden: false },
  { input: "0", expectedOutput: "0", isHidden: false },
  { input: "-4", expectedOutput: "-4", isHidden: true },
];

function providerWith(
  handler: (stdin: string) => ExecutionResult,
): CodeExecutionProvider {
  return {
    async execute(request) {
      return handler(request.stdin);
    },
  };
}

function ok(stdout: string): ExecutionResult {
  return {
    status: "succeeded",
    stdout,
    stderr: "",
    exitCode: 0,
    runtimeMs: 12,
  };
}

describe("evaluateSubmission", () => {
  it("runs only visible tests and includes I/O", async () => {
    const result = await evaluateSubmission({
      provider: providerWith((stdin) => ok(`${stdin}\n`)),
      language: python,
      source: "print(input())",
      tests,
      mode: "run",
      maxSourceChars: 1000,
      maxTimeoutMs: 8000,
    });

    expect(result.ok).toBe(true);
    expect(result.total).toBe(2);
    expect(result.allPassed).toBe(true);
    expect(result.tests[0]).toMatchObject({
      passed: true,
      label: "Test 1",
      input: "7",
      expected: "7",
      actual: "7\n",
    });
  });

  it("strips hidden test payloads on submit failures", async () => {
    const result = await evaluateSubmission({
      provider: providerWith((stdin) => ok(stdin === "-4" ? "wrong" : `${stdin}\n`)),
      language: python,
      source: "print(input())",
      tests,
      mode: "submit",
      maxSourceChars: 1000,
      maxTimeoutMs: 8000,
    });

    expect(result.allPassed).toBe(false);
    expect(result.passedCount).toBe(2);
    expect(result.total).toBe(3);
    const hidden = result.tests.at(-1);
    expect(hidden).toEqual({ passed: false, label: "Hidden Test" });
    expect(hidden).not.toHaveProperty("input");
    expect(JSON.stringify(result)).not.toContain("-4");
  });

  it("stops on compile errors without leaking later tests", async () => {
    const result = await evaluateSubmission({
      provider: {
        async execute() {
          return {
            status: "compile_error",
            stdout: "",
            stderr: "error: expected ';' before hidden secret -4",
            exitCode: null,
            runtimeMs: null,
          };
        },
      },
      language: python,
      source: "not valid",
      tests,
      mode: "submit",
      maxSourceChars: 1000,
      maxTimeoutMs: 8000,
    });

    expect(result.outcome).toBe("compile_error");
    expect(result.tests).toEqual([]);
    expect(result.message).toBe("Compilation failed.");
  });
});

describe("evaluateCustomInput", () => {
  it("runs once with the caller stdin and does not use tests", async () => {
    const result = await evaluateCustomInput({
      provider: {
        async execute(request) {
          return ok(`${request.stdin.trim()}\n`);
        },
      },
      language: python,
      source: "print(input())",
      stdin: "42",
      maxSourceChars: 1000,
      maxTimeoutMs: 8000,
    });

    expect(result.mode).toBe("try");
    expect(result.stdout).toBe("42\n");
    expect(result.stdin).toBe("42");
    expect(result.tests).toEqual([]);
    expect(result.message).toBe("Program finished.");
  });
});
