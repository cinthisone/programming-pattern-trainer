import type { ProgrammingLanguage } from "@/lib/languages/types";

export type ExecutionStatus =
  | "succeeded"
  | "compile_error"
  | "runtime_error"
  | "timeout"
  | "provider_unavailable";

export interface ExecutionRequest {
  language: ProgrammingLanguage;
  source: string;
  stdin: string;
  timeoutMs: number;
}

export interface ExecutionResult {
  status: ExecutionStatus;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  runtimeMs: number | null;
}

export interface CodeExecutionProvider {
  execute(input: ExecutionRequest): Promise<ExecutionResult>;
}

export type ExecuteMode = "run" | "submit" | "try";
