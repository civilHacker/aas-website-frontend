import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { Awards } from "@/components/about/Awards";
import { Newsletter } from "@/components/home/Newsletter";
import { SiteFooter } from "@/components/home/SiteFooter";
import { PageHeader } from "@/components/home/PageHeader";
import { getAwards } from "@/lib/awards";

export const metadata: Metadata = {
  title: "About — Abdallah Abu-Sheikh",
  description:
    "Born in Jordan, raised in England and China, educated in Canada and London — and building companies across the UAE and the Middle East.",
};

/** Seconds before awards edited in the admin panel appear on the page. */
export const revalidate = 30;

export default async function AboutPage() {
  const awards = await getAwards();

  return (
    <>
      <main className="flex-1 bg-black">
        <PageHeader active="about" />
        <AboutHero />
        {awards.length > 0 && <Awards awards={awards} />}
        <Newsletter />
      </main>
      <SiteFooter />
    </>
  );
}
