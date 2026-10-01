import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { SiteFooter } from "@/components/home/SiteFooter";
import { PageHeader } from "@/components/home/PageHeader";
import { SubmissionForm } from "@/components/problems/SubmissionForm";
import { getProblemBySlug } from "@/lib/problems";

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const problem = await getProblemBySlug(slug);
  if (!problem) return {};
  return {
    title: `${problem.title} — Abdallah Abu-Sheikh`,
    description: problem.body.replace(/^#+\s*/gm, "").slice(0, 160),
  };
}

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const problem = await getProblemBySlug(slug);
  if (!problem) notFound();

  return (
    <>
      <main className="flex-1 bg-black px-4 pb-24">
        <PageHeader active="problems" />
        <article className="mx-auto max-w-[760px] pt-16">
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/40">
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-white/70">{problem.category}</span>
            {problem.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
          <h1 className="mt-3 font-[Georgia,'Times_New_Roman',serif] text-[36px] leading-[1.1] text-white sm:text-[48px]">
            {problem.title}
          </h1>
          <div
            className="prose prose-invert prose-headings:font-[Georgia,'Times_New_Roman',serif] mt-8 max-w-none text-white/80"
            dangerouslySetInnerHTML={{ __html: marked.parse(problem.body) as string }}
          />

          <div className="mt-16 border-t border-white/10 pt-10">
            <h2 className="font-[Georgia,'Times_New_Roman',serif] text-[24px] text-white">
              Submit your solution
            </h2>
            <p className="mt-2 max-w-[500px] text-sm text-white/60">
              Upload a video, Excel file, or PDF — no account needed. We'll review it and follow up by
              email.
            </p>
            <div className="mt-6 max-w-[480px]">
              <SubmissionForm problemId={problem.id} />
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
