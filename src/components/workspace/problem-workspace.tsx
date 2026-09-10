"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import type { ResolvedProblem } from "@/lib/curriculum/types";
import type { ExecuteApiResponse, ExecuteMode } from "@/lib/execution/api";
import { JUDGE0_TUNNEL_COMMAND } from "@/lib/execution/tunnel-hint";
import { Button } from "@/components/ui/button";

const CodeEditor = dynamic(
  () => import("@/components/workspace/code-editor").then((mod) => mod.CodeEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center font-mono text-xs text-muted-foreground">
        Loading editor…
      </div>
    ),
  },
);

type SourceKind = "starter" | "solution";

function bufferKey(languageSlug: string, kind: SourceKind) {
  return `${languageSlug}:${kind}`;
}

function formatExecuteResult(payload: ExecuteApiResponse): string {
  if (!payload.ok) {
    return payload.error;
  }

  if (payload.mode === "try") {
    const lines = [payload.message];
    lines.push(`stdin\n${payload.stdin ?? ""}`);
    lines.push(`stdout\n${payload.stdout ?? ""}`);
    if (payload.detail) {
      lines.push(`stderr\n${payload.detail}`);
    }
    return lines.join("\n");
  }

  const lines = [payload.message];
  if (payload.detail) {
    lines.push(payload.detail);
  }
  for (const test of payload.tests) {
    const mark = test.passed ? "pass" : "fail";
    lines.push(`${mark}  ${test.label}`);
    if (test.input !== undefined) {
      lines.push(`      stdin    ${JSON.stringify(test.input)}`);
      lines.push(`      expected ${JSON.stringify(test.expected)}`);
      if (!test.passed) {
        lines.push(`      actual   ${JSON.stringify(test.actual ?? "")}`);
      }
    }
  }
  return lines.join("\n");
}

export function ProblemWorkspace({
  problem,
  languageSlug,
  onLanguageChange,
}: {
  problem: ResolvedProblem;
  languageSlug: string;
  onLanguageChange: (slug: string) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [kind, setKind] = useState<SourceKind>("solution");
  const [busy, setBusy] = useState(false);
  const [consoleText, setConsoleText] = useState(
    "Type your own stdin and click Try, or Run the official tests.",
  );
  const [customStdin, setCustomStdin] = useState(
    problem.tests.find((test) => !test.isHidden)?.input ?? problem.exampleInput,
  );
  const [buffers, setBuffers] = useState<Record<string, string>>(() => {
    const next: Record<string, string> = {};
    for (const implementation of problem.languages) {
      next[bufferKey(implementation.languageSlug, "starter")] =
        implementation.starterCode;
      next[bufferKey(implementation.languageSlug, "solution")] =
        implementation.solutionCode;
    }
    return next;
  });

  const active = useMemo(
    () =>
      problem.languages.find((item) => item.languageSlug === languageSlug) ??
      problem.languages[0],
    [languageSlug, problem.languages],
  );

  const key = active ? bufferKey(active.languageSlug, kind) : "";
  const value = buffers[key] ?? "";
  const monacoTheme = resolvedTheme === "light" ? "vs" : "vs-dark";

  async function execute(mode: ExecuteMode) {
    if (!active) {
      return;
    }
    setBusy(true);
    setConsoleText(mode === "run" ? "Running…" : mode === "submit" ? "Submitting…" : "Trying…");
    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemSlug: problem.slug,
          languageSlug: active.languageSlug,
          source: value,
          mode,
          stdin: mode === "try" ? customStdin : undefined,
        }),
      });
      const payload = (await response.json()) as ExecuteApiResponse;
      setConsoleText(formatExecuteResult(payload));
    } catch {
      setConsoleText(
        `Could not reach the execution service. In a terminal, run: ${JUDGE0_TUNNEL_COMMAND}`,
      );
    } finally {
      setBusy(false);
    }
  }

  function selectLanguage(nextSlug: string) {
    onLanguageChange(nextSlug);
    router.replace(`${pathname}?language=${nextSlug}`, { scroll: false });
  }

  if (!active) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No language implementations.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[28rem] min-w-0 flex-col md:min-h-0">
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border px-2">
        <div className="flex min-w-0 flex-1">
          {problem.languages.map((implementation) => {
            const selected = implementation.languageSlug === active.languageSlug;
            return (
              <button
                key={implementation.languageSlug}
                type="button"
                onClick={() => selectLanguage(implementation.languageSlug)}
                className={`shrink-0 border-b-2 px-3 py-2 font-mono text-xs transition-colors ${
                  selected
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {implementation.language.name}
              </button>
            );
          })}
        </div>
        <div className="flex shrink-0 gap-1 py-1">
          <Button
            type="button"
            size="xs"
            variant={kind === "starter" ? "secondary" : "ghost"}
            onClick={() => setKind("starter")}
          >
            Starter
          </Button>
          <Button
            type="button"
            size="xs"
            variant={kind === "solution" ? "secondary" : "ghost"}
            onClick={() => setKind("solution")}
          >
            Solution
          </Button>
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <CodeEditor
          key={key}
          language={active.language.monacoLanguage}
          value={value}
          theme={monacoTheme}
          onChange={(next) =>
            setBuffers((current) => ({ ...current, [key]: next }))
          }
        />
      </div>
      <div className="border-t border-border px-3 py-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[11px] text-muted-foreground">
              {active.functionSignature}
            </p>
            {kind === "solution" ? (
              <p className="mt-1 text-xs text-muted-foreground">{active.explanation}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 gap-1">
            <Button
              type="button"
              size="xs"
              variant="outline"
              disabled={busy || value.length === 0}
              onClick={() => void execute("try")}
            >
              Try
            </Button>
            <Button
              type="button"
              size="xs"
              variant="outline"
              disabled={busy || value.length === 0}
              onClick={() => void execute("run")}
            >
              Run tests
            </Button>
            <Button
              type="button"
              size="xs"
              disabled={busy || value.length === 0}
              onClick={() => void execute("submit")}
            >
              Submit
            </Button>
          </div>
        </div>
        <label className="mt-2 block">
          <span className="text-[11px] text-muted-foreground">Your stdin</span>
          <textarea
            value={customStdin}
            onChange={(event) => setCustomStdin(event.target.value)}
            spellCheck={false}
            rows={3}
            className="mt-1 w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-1.5 font-mono text-xs leading-5 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            placeholder="Type a number, then click Try"
          />
        </label>
        <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
          Before Try/Run/Submit, keep this running in a terminal:{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-foreground">
            {JUDGE0_TUNNEL_COMMAND}
          </code>
        </p>
        <pre className="mt-1 max-h-36 overflow-auto whitespace-pre-wrap font-mono text-[11px] leading-5 text-muted-foreground">
          {consoleText}
        </pre>
      </div>
    </div>
  );
}
