import type { ProgrammingLanguage } from "@/lib/languages/types";
import type { ExecutionRequest } from "@/lib/execution/types";

export class ExecutionRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExecutionRequestError";
  }
}

export function buildExecutionRequest(input: {
  language: ProgrammingLanguage;
  source: string;
  stdin: string;
  maxSourceChars: number;
  maxTimeoutMs: number;
}): ExecutionRequest {
  if (!input.language.enabled) {
    throw new ExecutionRequestError(`Language is disabled: ${input.language.slug}`);
  }

  if (input.source.length === 0) {
    throw new ExecutionRequestError("Source code is empty");
  }

  if (input.source.length > input.maxSourceChars) {
    throw new ExecutionRequestError("Source code exceeds the size limit");
  }

  const timeoutMs = Math.min(
    Math.max(input.language.defaultTimeoutMs, 1),
    input.maxTimeoutMs,
  );

  return {
    language: input.language,
    source: input.source,
    stdin: input.stdin,
    timeoutMs,
  };
}
