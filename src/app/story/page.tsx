import type { Metadata } from "next";
import { SiteFooter } from "@/components/home/SiteFooter";
import { PageHeader } from "@/components/home/PageHeader";
import { Timeline } from "@/components/story/Timeline";

export const metadata: Metadata = {
  title: "Story — Abdallah Abu-Sheikh",
  description:
    "From Jordan to England, Canada to London, and finally the UAE — every chapter that shaped the builder.",
};

export default function StoryPage() {
  return (
    <>
      <main className="flex-1 bg-black">
        <PageHeader active="story" />
        <section className="flex flex-col items-center gap-6 px-5 pt-14 pb-16 text-center sm:gap-8 sm:pt-[70px] sm:pb-24 lg:pb-[110px]">
          <h1 className="text-[44px] leading-[0.95] text-white sm:text-[58px] lg:text-[71px]">
            The Journey So Far
          </h1>
          <p className="max-w-[542px] text-[17px] text-white/60 sm:text-[20px]">
            From Jordan to England, Canada to London, and finally the UAE —
            every chapter shaped the builder I became.
          </p>
        </section>
        <Timeline />
      </main>
      <SiteFooter />
    </>
  );
}
