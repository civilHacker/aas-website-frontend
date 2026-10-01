import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/home/SiteFooter";
import { PageHeader } from "@/components/home/PageHeader";
import { getBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Abdallah Abu-Sheikh",
  description: "Posts and updates.",
};

export const revalidate = 30;

function firstLine(body: string): string {
  const plain = body.replace(/^#+\s*/gm, "").replace(/\n+/g, " ").trim();
  return plain.slice(0, 160);
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <main className="flex-1 bg-black px-4 pb-24">
        <PageHeader active="blog" />
        <div className="mx-auto max-w-[900px] pt-16">
          <h1 className="font-[Georgia,'Times_New_Roman',serif] text-[40px] leading-[1.08] tracking-[-0.02em] text-white sm:text-[56px]">
            Blog
          </h1>

          {posts.length === 0 ? (
            <p className="mt-16 text-white/40">Nothing published yet.</p>
          ) : (
            <ul className="mt-12 flex flex-col gap-6">
              {posts.map((post) => (
                <li key={post.id} className="border-b border-white/10 pb-6">
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <p className="text-xs text-white/40">{formatDate(post.createdAt)}</p>
                    <h2 className="mt-2 font-[Georgia,'Times_New_Roman',serif] text-[26px] leading-[1.15] text-white group-hover:underline">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-white/60">{firstLine(post.body)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
