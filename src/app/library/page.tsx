import type { Metadata } from "next";
import { SiteFooter } from "@/components/home/SiteFooter";
import { PageHeader } from "@/components/home/PageHeader";
import { LibrarySection } from "@/components/library/LibrarySection";

export const metadata: Metadata = {
  title: "The Founder’s Shelf — Abdallah Abu-Sheikh",
  description:
    "The books Abdallah Abu-Sheikh keeps returning to, on a shelf you can browse and open.",
};

export default function LibraryPage() {
  return (
    <>
      <main className="flex-1 bg-black">
        <LibrarySection
          header={<PageHeader active="library" onDark={false} />}
        />
      </main>
      <SiteFooter />
    </>
  );
}
