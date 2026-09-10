import { ProblemList } from "@/components/catalog/problem-list";
import { BasicsTopicTabs } from "@/components/catalog/topic-tabs";
import { TrackTabs } from "@/components/catalog/track-tabs";
import { listPublishedProblems } from "@/lib/curriculum/catalog";
import {
  BASICS_TOPICS,
  isBasicsTopicSlug,
  matchesBasicsTopic,
} from "@/lib/curriculum/tracks";

export default async function BasicsPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic: topicParam } = await searchParams;
  const topic = isBasicsTopicSlug(topicParam) ? topicParam : "all";
  const problems = listPublishedProblems({ track: "basics" }).filter((problem) =>
    matchesBasicsTopic(problem, topic),
  );

  const groups =
    topic === "all"
      ? BASICS_TOPICS.filter((item) => item.slug !== "all").map((item) => ({
          topic: item,
          problems: problems.filter((problem) => matchesBasicsTopic(problem, item.slug)),
        })).filter((group) => group.problems.length > 0)
      : null;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <TrackTabs current="basics" />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Basics</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Language-independent building blocks: variables, control structures, loops,
        arrays, and sets. Same problem, every supported language.
      </p>
      <div className="mt-6">
        <BasicsTopicTabs current={topic} />
      </div>
      {groups ? (
        <div className="mt-2">
          {groups.map((group) => (
            <section key={group.topic.slug} className="mt-10">
              <h2 className="text-2xl font-semibold tracking-tight">
                {group.topic.label}
              </h2>
              <ProblemList problems={group.problems} />
            </section>
          ))}
        </div>
      ) : (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight">
            {BASICS_TOPICS.find((item) => item.slug === topic)?.label}
          </h2>
          <ProblemList problems={problems} />
        </section>
      )}
    </main>
  );
}
