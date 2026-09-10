"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ProblemHint } from "@/lib/curriculum/types";

export function HintList({ hints }: { hints: ProblemHint[] }) {
  const ordered = hints.slice().sort((a, b) => a.hintLevel - b.hintLevel);
  const [visible, setVisible] = useState(1);

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Hints
        </h2>
        {visible < ordered.length ? (
          <Button
            type="button"
            size="xs"
            variant="ghost"
            onClick={() => setVisible((count) => Math.min(count + 1, ordered.length))}
          >
            Next hint
          </Button>
        ) : null}
      </div>
      <ol className="mt-2 space-y-2">
        {ordered.slice(0, visible).map((hint) => (
          <li key={hint.hintLevel} className="text-sm leading-6">
            <span className="font-mono text-[11px] text-muted-foreground">
              {hint.hintLevel}.
            </span>{" "}
            {hint.content}
          </li>
        ))}
      </ol>
    </section>
  );
}
