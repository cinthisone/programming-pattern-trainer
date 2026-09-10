import { notFound } from "next/navigation";
import { getPublishedProblem } from "@/lib/curriculum/catalog";
import { ProblemSession } from "@/components/workspace/problem-session";

export default async function ProblemPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ language?: string }>;
}) {
  const { slug } = await params;
  const { language } = await searchParams;
  const problem = getPublishedProblem(slug);

  if (!problem) {
    notFound();
  }

  const requested = problem.languages.find((item) => item.languageSlug === language);
  const initialLanguageSlug =
    requested?.languageSlug ?? problem.languages[0]?.languageSlug ?? "python";

  return (
    <ProblemSession problem={problem} initialLanguageSlug={initialLanguageSlug} />
  );
}
