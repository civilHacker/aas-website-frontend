import type { Metadata } from "next";
import { SiteFooter } from "@/components/home/SiteFooter";
import { PageHeader } from "@/components/home/PageHeader";
import { getMentorshipPrograms } from "@/lib/mentorship";

export const metadata: Metadata = {
  title: "Mentorship — Abdallah Abu-Sheikh",
  description: "Mentorship programs and cohorts.",
};

export const revalidate = 30;

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function MentorshipPage() {
  const programs = await getMentorshipPrograms();

  return (
    <>
      <main className="flex-1 bg-black px-4 pb-24">
        <PageHeader active="mentorship" />
        <div className="mx-auto max-w-[1200px] pt-16">
          <h1 className="font-[Georgia,'Times_New_Roman',serif] text-[40px] leading-[1.08] tracking-[-0.02em] text-white sm:text-[56px]">
            Mentorship
          </h1>

          {programs.length === 0 ? (
            <p className="mt-16 text-white/40">Nothing published yet.</p>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <article key={program.id} className="flex flex-col gap-2">
                  <div className="aspect-square w-full overflow-hidden rounded-[20px] bg-linear-to-b from-[#357172] to-[#343434]">
                    {program.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={program.image} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  {program.date ? (
                    <p className="mt-2 text-xs text-white/40">{formatDate(program.date)}</p>
                  ) : null}
                  <h2 className="font-manrope text-[18px] leading-[1.35] text-white sm:text-[20px]">
                    {program.title}
                  </h2>
                  <p className="line-clamp-3 text-[15px] leading-[1.4] text-white/60">
                    {program.description}
                  </p>
                  {program.link ? (
                    <a
                      href={program.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 w-fit rounded-[40px] bg-white/10 px-[14px] py-[8px] text-[14px] text-white hover:bg-white/20"
                    >
                      Learn more
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
