import type {
  CodeExecutionProvider,
  ExecutionRequest,
  ExecutionResult,
} from "@/lib/execution/types";
import { mapJudge0StatusId } from "@/lib/execution/judge0-status";

interface Judge0Config {
  baseUrl: string;
  apiKey: string;
}

interface Judge0Submission {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  time: string | null;
  exit_code: number | null;
  status?: { id: number; description: string };
}

export class Judge0Provider implements CodeExecutionProvider {
  constructor(private readonly config: Judge0Config) {}

  async execute(input: ExecutionRequest): Promise<ExecutionResult> {
    const cpuSeconds = Math.max(input.timeoutMs / 1000, 0.1);
    const wallSeconds = Math.min(cpuSeconds + 3, 20);
    const languageId = Number(input.language.executionLanguageId);
    if (!Number.isFinite(languageId)) {
      return unavailable();
    }

    let response: Response;
    try {
      response = await fetch(
        `${this.config.baseUrl}/submissions?base64_encoded=false&wait=true`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": this.config.apiKey,
          },
          body: JSON.stringify({
            source_code: input.source,
            language_id: languageId,
            stdin: input.stdin,
            cpu_time_limit: cpuSeconds,
            wall_time_limit: wallSeconds,
          }),
          signal: AbortSignal.timeout(input.timeoutMs + 20_000),
        },
      );
    } catch {
      return unavailable();
    }

    if (!response.ok) {
      return unavailable();
    }

    let body: Judge0Submission;
    try {
      body = (await response.json()) as Judge0Submission;
    } catch {
      return unavailable();
    }

    const statusId = body.status?.id;
    if (typeof statusId !== "number") {
      return unavailable();
    }

    const status = mapJudge0StatusId(statusId);
    const compile = body.compile_output ?? "";
    const stderr = body.stderr ?? body.message ?? "";
    const timeSeconds = body.time ? Number(body.time) : Number.NaN;

    return {
      status,
      stdout: body.stdout ?? "",
      stderr: status === "compile_error" ? compile || stderr : stderr,
      exitCode: body.exit_code,
      runtimeMs: Number.isFinite(timeSeconds) ? Math.round(timeSeconds * 1000) : null,
    };
  }
}

function unavailable(): ExecutionResult {
  return {
    status: "provider_unavailable",
    stdout: "",
    stderr: "",
    exitCode: null,
    runtimeMs: null,
  };
}
