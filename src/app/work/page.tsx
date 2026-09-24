import type { Metadata } from "next";
import { SiteFooter } from "@/components/home/SiteFooter";
import { Ventures } from "@/components/home/Ventures";
import { Testimonials } from "@/components/work/Testimonials";
import { WorkHero } from "@/components/work/WorkHero";

export const metadata: Metadata = {
  title: "Work — Abdallah Abu-Sheikh",
  description:
    "Six ventures, one conviction — from renewable energy to fintech to super-apps, each company built to solve a real problem across the region.",
};

export default function WorkPage() {
  return (
    <>
      <main className="flex-1 bg-black">
        <WorkHero />
        <Ventures />
        <Testimonials />
      </main>
      <SiteFooter />
    </>
  );
}
