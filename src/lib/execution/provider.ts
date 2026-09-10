import { getJudge0Config } from "@/lib/env";
import { Judge0Provider } from "@/lib/execution/judge0";
import type { CodeExecutionProvider } from "@/lib/execution/types";

export function createExecutionProvider(): CodeExecutionProvider | null {
  const config = getJudge0Config();
  if (!config) {
    return null;
  }
  return new Judge0Provider(config);
}
