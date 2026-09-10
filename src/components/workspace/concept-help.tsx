"use client";

import { useState } from "react";
import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getPrimer } from "@/lib/curriculum/primers";

export function ConceptHelpButton({
  conceptSlug,
  languageSlug,
  languageName,
}: {
  conceptSlug: string;
  languageSlug: string;
  languageName: string;
}) {
  const [open, setOpen] = useState(false);
  const primer = getPrimer(conceptSlug, languageSlug);
  if (!primer) {
    return null;
  }

  const label = `${primer.title} in ${languageName}`;

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label={`Learn ${label}`}
            onClick={() => setOpen(true)}
          >
            <CircleHelp />
            <span className="hidden sm:inline">Help</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Learn {label}</TooltipContent>
      </Tooltip>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[min(90vh,48rem)] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
            <DialogDescription>{primer.idea}</DialogDescription>
          </DialogHeader>
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              In {languageName}
            </p>
            <p className="mt-2 text-sm leading-6">{primer.how}</p>
          </div>
          {primer.keywords && primer.keywords.length > 0 ? (
            <dl className="divide-y divide-border rounded-md border border-border">
              {primer.keywords.map((keyword) => (
                <div
                  key={keyword.name}
                  className="grid gap-1 px-3 py-2.5 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-3"
                >
                  <dt className="font-mono text-xs font-medium">{keyword.name}</dt>
                  <dd className="text-sm leading-6 text-muted-foreground">
                    <p>{keyword.use}</p>
                    {keyword.modern === false ? (
                      <p className="mt-1.5 text-xs leading-5">
                        <span className="font-medium text-foreground">
                          Not recommended for modern apps.
                        </span>{" "}
                        {keyword.whyNotModern} Still taught here so you can read older code.
                      </p>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
          <pre className="overflow-x-auto rounded-md border border-border bg-muted/40 p-3 font-mono text-xs leading-5">
            {primer.example}
          </pre>
          {primer.sections?.map((section) => (
            <section key={section.heading}>
              <h3 className="text-sm font-medium tracking-tight">{section.heading}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{section.body}</p>
              {section.example ? (
                <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-muted/40 p-3 font-mono text-xs leading-5">
                  {section.example}
                </pre>
              ) : null}
            </section>
          ))}
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Watch for
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
              {primer.watch.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
