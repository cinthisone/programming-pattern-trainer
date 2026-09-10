import { NextResponse } from "next/server";
import { executionApiRequestSchema } from "@/lib/validation/execution";
import { LANGUAGE_SEED } from "@/lib/languages/seed";
import { requireEnabledLanguageBySlug } from "@/lib/languages/lookup";
import { ExecutionRequestError } from "@/lib/execution/request";
import { createExecutionProvider } from "@/lib/execution/provider";
import { evaluateCustomInput, evaluateSubmission } from "@/lib/execution/evaluate";
import { getMaxSourceChars, getMaxTimeoutMs } from "@/lib/env";
import { getCurrentUser } from "@/lib/auth/user";
import { getPublishedProblem } from "@/lib/curriculum/catalog";
import { JUDGE0_UNAVAILABLE_MESSAGE } from "@/lib/execution/tunnel-hint";

export const maxDuration = 60;

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = executionApiRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Validation failed" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Sign in to run code." },
      { status: 401 },
    );
  }

  const problem = getPublishedProblem(parsed.data.problemSlug);
  if (!problem) {
    return NextResponse.json({ ok: false, error: "Problem not found" }, { status: 404 });
  }

  const hasLanguage = problem.languages.some(
    (implementation) => implementation.languageSlug === parsed.data.languageSlug,
  );
  if (!hasLanguage) {
    return NextResponse.json(
      { ok: false, error: "This problem is not available in that language" },
      { status: 400 },
    );
  }

  const provider = createExecutionProvider();
  if (!provider) {
    return NextResponse.json(
      { ok: false, error: JUDGE0_UNAVAILABLE_MESSAGE },
      { status: 503 },
    );
  }

  try {
    const language = requireEnabledLanguageBySlug(
      LANGUAGE_SEED,
      parsed.data.languageSlug,
    );

    if (parsed.data.mode === "try") {
      const result = await evaluateCustomInput({
        provider,
        language,
        source: parsed.data.source,
        stdin: parsed.data.stdin ?? "",
        maxSourceChars: getMaxSourceChars(),
        maxTimeoutMs: getMaxTimeoutMs(),
      });
      if (result.outcome === "provider_unavailable") {
        return NextResponse.json(result, { status: 503 });
      }
      return NextResponse.json(result);
    }

    const result = await evaluateSubmission({
      provider,
      language,
      source: parsed.data.source,
      tests: problem.tests,
      mode: parsed.data.mode,
      maxSourceChars: getMaxSourceChars(),
      maxTimeoutMs: getMaxTimeoutMs(),
    });

    if (result.outcome === "provider_unavailable") {
      return NextResponse.json(result, { status: 503 });
    }

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof ExecutionRequestError || error instanceof Error
        ? error.message
        : "Invalid execution request";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
