import Link from "next/link";
import { cn } from "cn";
import type { CurriculumTrack } from "@/lib/curriculum/types";

const TRACKS: { href: string; track: CurriculumTrack; label: string }[] = [
  { href: "/basics", track: "basics", label: "Basics" },
  { href: "/problems", track: "patterns", label: "Patterns" },
];

export function TrackTabs({ current }: { current: CurriculumTrack }) {
  return (
    <div className="inline-flex w-fit items-center rounded-lg bg-muted p-[3px] text-muted-foreground">
      {TRACKS.map((item) => {
        const active = item.track === current;
        return (
          <Link
            key={item.track}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-7 items-center justify-center rounded-md px-3 text-sm font-medium transition-all",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-foreground/60 hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
