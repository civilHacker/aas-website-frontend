import type { Metadata } from "next";
import { SiteFooter } from "@/components/home/SiteFooter";
import { PageHeader } from "@/components/home/PageHeader";
import { LibraryCollections } from "@/components/library/LibraryCollections";
import { getLibraryBooks } from "@/lib/library";

export const metadata: Metadata = {
  title: "The Founder’s Shelf — Abdallah Abu-Sheikh",
  description:
    "The books Abdallah Abu-Sheikh keeps returning to, on a shelf you can browse and open.",
};

export const revalidate = 30;

export default async function LibraryPage() {
  const books = await getLibraryBooks();

  return (
    <>
      <main className="flex-1 bg-black">
        <LibraryCollections
          books={books}
          header={<PageHeader active="library" onDark={false} />}
        />
      </main>
      <SiteFooter />
    </>
  );
}
