import { outputsMatch } from "@/lib/execution/compare";
import { buildExecutionRequest, ExecutionRequestError } from "@/lib/execution/request";
import type {
  ClientTestResult,
  ExecuteApiSuccess,
  ExecuteOutcome,
} from "@/lib/execution/api";
import type { CodeExecutionProvider, ExecuteMode } from "@/lib/execution/types";
import type { ProblemTestCase } from "@/lib/curriculum/types";
import type { ProgrammingLanguage } from "@/lib/languages/types";
import { JUDGE0_UNAVAILABLE_MESSAGE } from "@/lib/execution/tunnel-hint";

const DETAIL_LIMIT = 4000;

export async function evaluateSubmission(input: {
  provider: CodeExecutionProvider;
  language: ProgrammingLanguage;
  source: string;
  tests: ProblemTestCase[];
  mode: Exclude<ExecuteMode, "try">;
  maxSourceChars: number;
  maxTimeoutMs: number;
}): Promise<ExecuteApiSuccess> {
  const selected =
    input.mode === "run"
      ? input.tests.filter((test) => !test.isHidden)
      : input.tests;

  if (selected.length === 0) {
    throw new ExecutionRequestError("This problem has no tests for this mode");
  }

  const tests: ClientTestResult[] = [];
  let passedCount = 0;

  for (const [index, test] of selected.entries()) {
    const request = buildExecutionRequest({
      language: input.language,
      source: input.source,
      stdin: test.input,
      maxSourceChars: input.maxSourceChars,
      maxTimeoutMs: input.maxTimeoutMs,
    });
    const result = await input.provider.execute(request);

    if (result.status === "provider_unavailable") {
      return {
        ok: true,
        mode: input.mode,
        passedCount,
        total: selected.length,
        allPassed: false,
        outcome: "provider_unavailable",
        message: JUDGE0_UNAVAILABLE_MESSAGE,
        tests,
      };
    }

    if (result.status === "compile_error") {
      return {
        ok: true,
        mode: input.mode,
        passedCount,
        total: selected.length,
        allPassed: false,
        outcome: "compile_error",
        message: "Compilation failed.",
        detail: truncate(result.stderr),
        tests,
      };
    }

    if (result.status === "timeout") {
      tests.push(
        toClientTest({
          test,
          index,
          passed: false,
          actual: result.stdout,
        }),
      );
      return {
        ok: true,
        mode: input.mode,
        passedCount,
        total: selected.length,
        allPassed: false,
        outcome: "timeout",
        message: "The program exceeded the time limit.",
        tests,
      };
    }

    if (result.status === "runtime_error") {
      tests.push(
        toClientTest({
          test,
          index,
          passed: false,
          actual: result.stdout,
        }),
      );
      return {
        ok: true,
        mode: input.mode,
        passedCount,
        total: selected.length,
        allPassed: false,
        outcome: "runtime_error",
        message: "Program crashed.",
        detail: truncate(result.stderr),
        tests,
      };
    }

    const passed = outputsMatch(result.stdout, test.expectedOutput);
    if (passed) {
      passedCount += 1;
    }
    tests.push(
      toClientTest({
        test,
        index,
        passed,
        actual: result.stdout,
      }),
    );
  }

  const allPassed = passedCount === selected.length;
  const outcome: ExecuteOutcome = allPassed ? "succeeded" : "failed_tests";

  return {
    ok: true,
    mode: input.mode,
    passedCount,
    total: selected.length,
    allPassed,
    outcome,
    message: allPassed
      ? "All tests passed."
      : `Tests passed ${passedCount} / ${selected.length}.`,
    tests,
  };
}

function toClientTest(input: {
  test: ProblemTestCase;
  index: number;
  passed: boolean;
  actual: string;
}): ClientTestResult {
  if (input.test.isHidden) {
    return { passed: input.passed, label: "Hidden Test" };
  }

  return {
    passed: input.passed,
    label: `Test ${input.index + 1}`,
    input: input.test.input,
    expected: input.test.expectedOutput,
    actual: input.actual,
  };
}

function truncate(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.length <= DETAIL_LIMIT) {
    return trimmed;
  }
  return `${trimmed.slice(0, DETAIL_LIMIT)}\n…`;
}

export async function evaluateCustomInput(input: {
  provider: CodeExecutionProvider;
  language: ProgrammingLanguage;
  source: string;
  stdin: string;
  maxSourceChars: number;
  maxTimeoutMs: number;
}): Promise<ExecuteApiSuccess> {
  const request = buildExecutionRequest({
    language: input.language,
    source: input.source,
    stdin: input.stdin,
    maxSourceChars: input.maxSourceChars,
    maxTimeoutMs: input.maxTimeoutMs,
  });
  const result = await input.provider.execute(request);

  const messageByStatus: Record<typeof result.status, string> = {
    succeeded: "Program finished.",
    compile_error: "Compilation failed.",
    runtime_error: "Program crashed.",
    timeout: "The program exceeded the time limit.",
    provider_unavailable: JUDGE0_UNAVAILABLE_MESSAGE,
  };

  return {
    ok: true,
    mode: "try",
    passedCount: 0,
    total: 0,
    allPassed: result.status === "succeeded",
    outcome: result.status,
    message: messageByStatus[result.status],
    detail: truncate(result.stderr),
    stdout: result.stdout,
    stdin: input.stdin,
    tests: [],
  };
}
