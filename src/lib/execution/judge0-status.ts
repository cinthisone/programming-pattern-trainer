import type { ExecutionStatus } from "@/lib/execution/types";

/** Judge0 CE status ids: https://github.com/judge0/judge0 */
export function mapJudge0StatusId(statusId: number): ExecutionStatus {
  if (statusId === 3) {
    return "succeeded";
  }
  if (statusId === 5) {
    return "timeout";
  }
  if (statusId === 6) {
    return "compile_error";
  }
  if (statusId >= 7 && statusId <= 12) {
    return "runtime_error";
  }
  return "provider_unavailable";
}
