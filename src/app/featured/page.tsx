import type { Metadata } from "next";
import { FeaturedSection } from "@/components/featured/FeaturedSection";
import { SiteFooter } from "@/components/home/SiteFooter";
import { PageHeader } from "@/components/home/PageHeader";
import { getFeaturedItems } from "@/lib/featured";

export const metadata: Metadata = {
  title: "Featured — Abdallah Abu-Sheikh",
  description:
    "Articles, press, podcasts and talks that have moved audiences across the region and beyond.",
};

/** Seconds before entries added in the admin panel appear on the page. */
export const revalidate = 30;

export default async function FeaturedPage() {
  const items = await getFeaturedItems();

  return (
    <>
      <main className="flex-1 bg-black">
        <PageHeader active="featured" />
        <FeaturedSection items={items} />
      </main>
      <SiteFooter />
    </>
  );
}
