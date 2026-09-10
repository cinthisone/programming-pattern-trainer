import type { ExecuteMode, ExecutionStatus } from "@/lib/execution/types";

export type { ExecuteMode };

export type ExecuteOutcome = ExecutionStatus | "failed_tests";

export interface ClientTestResult {
  passed: boolean;
  label: string;
  input?: string;
  expected?: string;
  actual?: string;
}

export interface ExecuteApiSuccess {
  ok: true;
  mode: ExecuteMode;
  passedCount: number;
  total: number;
  allPassed: boolean;
  outcome: ExecuteOutcome;
  message: string;
  detail?: string;
  stdout?: string;
  stdin?: string;
  tests: ClientTestResult[];
}

export interface ExecuteApiError {
  ok: false;
  error: string;
}

export type ExecuteApiResponse = ExecuteApiSuccess | ExecuteApiError;
