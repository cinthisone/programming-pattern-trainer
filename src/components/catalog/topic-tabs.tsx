import Link from "next/link";
import { cn } from "cn";
import {
  BASICS_TOPICS,
  type BasicsTopicSlug,
} from "@/lib/curriculum/tracks";

export function BasicsTopicTabs({ current }: { current: BasicsTopicSlug }) {
  return (
    <div className="flex flex-wrap gap-1">
      {BASICS_TOPICS.map((topic) => {
        const href = topic.slug === "all" ? "/basics" : `/basics?topic=${topic.slug}`;
        const active = topic.slug === current;
        return (
          <Link
            key={topic.slug}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
              active
                ? "border-foreground/20 bg-foreground text-background"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {topic.label}
          </Link>
        );
      })}
    </div>
  );
}
