import type { Metadata } from "next";
import { FeaturedSection } from "@/components/featured/FeaturedSection";
import { SiteFooter } from "@/components/home/SiteFooter";
import { PageHeader } from "@/components/home/PageHeader";

export const metadata: Metadata = {
  title: "Featured — Abdallah Abu-Sheikh",
  description:
    "Articles, press, podcasts and talks that have moved audiences across the region and beyond.",
};

export default function FeaturedPage() {
  return (
    <>
      <main className="flex-1 bg-black">
        <PageHeader active="featured" />
        <FeaturedSection />
      </main>
      <SiteFooter />
    </>
  );
}
