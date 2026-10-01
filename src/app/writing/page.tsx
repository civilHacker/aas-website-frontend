import type { Metadata } from "next";
import { SiteFooter } from "@/components/home/SiteFooter";
import { PageHeader } from "@/components/home/PageHeader";
import { getWritings } from "@/lib/writings";

export const metadata: Metadata = {
  title: "Writing — Abdallah Abu-Sheikh",
  description: "Essays and short pieces.",
};

export const revalidate = 30;

export default async function WritingPage() {
  const writings = await getWritings();

  return (
    <>
      <main className="flex-1 bg-black px-4 pb-24">
        <PageHeader active="writing" />
        <div className="mx-auto max-w-[1200px] pt-16">
          <h1 className="font-[Georgia,'Times_New_Roman',serif] text-[40px] leading-[1.08] tracking-[-0.02em] text-white sm:text-[56px]">
            Writing
          </h1>

          {writings.length === 0 ? (
            <p className="mt-16 text-white/40">Nothing published yet.</p>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {writings.map((writing) => (
                <article key={writing.id} className="flex flex-col gap-2">
                  <div className="aspect-square w-full overflow-hidden rounded-[20px] bg-linear-to-b from-[#357172] to-[#343434]">
                    {writing.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={writing.image} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <h2 className="mt-2 font-manrope text-[18px] leading-[1.35] text-white sm:text-[20px]">
                    {writing.title}
                  </h2>
                  <p className="line-clamp-3 text-[15px] leading-[1.4] text-white/60">
                    {writing.description}
                  </p>
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
