import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/home/SiteFooter";
import { PageHeader } from "@/components/home/PageHeader";
import { getProblems } from "@/lib/problems";

export const metadata: Metadata = {
  title: "Problems — Abdallah Abu-Sheikh",
  description: "Problem statements: what's broken, who feels it, and what any fix has to respect.",
};

/** Seconds before entries added in the admin panel appear on the page. */
export const revalidate = 30;

function firstLine(body: string): string {
  const plain = body.replace(/^#+\s*/gm, "").replace(/\n+/g, " ").trim();
  return plain.slice(0, 160);
}

export default async function ProblemsPage() {
  const problems = await getProblems();

  return (
    <>
      <main className="flex-1 bg-black px-4 pb-24">
        <PageHeader active="problems" />
        <div className="mx-auto max-w-[900px] pt-16">
          <h1 className="font-[Georgia,'Times_New_Roman',serif] text-[40px] leading-[1.08] tracking-[-0.02em] text-white sm:text-[56px]">
            Problems
          </h1>
          <p className="mt-4 max-w-[560px] text-white/60">
            Problem statements worth stating plainly: what's broken, who feels it, and what any fix
            has to respect.
          </p>

          {problems.length === 0 ? (
            <p className="mt-16 text-white/40">Nothing published yet.</p>
          ) : (
            <ul className="mt-12 flex flex-col gap-6">
              {problems.map((problem) => (
                <li key={problem.id} className="border-b border-white/10 pb-6">
                  <Link href={`/problems/${problem.slug}`} className="group block">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-white/40">
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-white/70">
                        {problem.category}
                      </span>
                      {problem.tags.map((tag) => (
                        <span key={tag}>#{tag}</span>
                      ))}
                    </div>
                    <h2 className="mt-2 font-[Georgia,'Times_New_Roman',serif] text-[26px] leading-[1.15] text-white group-hover:underline">
                      {problem.title}
                    </h2>
                    <p className="mt-2 text-white/60">{firstLine(problem.body)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
