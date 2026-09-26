import type { Metadata } from "next";
import { BookNotes } from "@/components/home/BookNotes";
import { Contact } from "@/components/home/Contact";
import { Hero } from "@/components/home/Hero";
import { Newsletter } from "@/components/home/Newsletter";
import { SiteFooter } from "@/components/home/SiteFooter";
import { Stats } from "@/components/home/Stats";
import { Ventures } from "@/components/home/Ventures";

export const metadata: Metadata = {
  title: "Overview — Abdallah Abu-Sheikh",
};

export default function OverviewPage() {
  return (
    <>
      <main className="flex-1 bg-black">
        <Hero />
        <Stats />
        <Ventures />
        <BookNotes />
        <Contact />
        <Newsletter />
      </main>
      <SiteFooter />
    </>
  );
}
