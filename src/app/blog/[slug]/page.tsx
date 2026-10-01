import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { SiteFooter } from "@/components/home/SiteFooter";
import { PageHeader } from "@/components/home/PageHeader";
import { getBlogPostBySlug } from "@/lib/blog";

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Abdallah Abu-Sheikh`,
    description: post.body.replace(/^#+\s*/gm, "").slice(0, 160),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <main className="flex-1 bg-black px-4 pb-24">
        <PageHeader active="blog" />
        <article className="mx-auto max-w-[760px] pt-16">
          <h1 className="font-[Georgia,'Times_New_Roman',serif] text-[36px] leading-[1.1] text-white sm:text-[48px]">
            {post.title}
          </h1>
          <div
            className="prose prose-invert prose-headings:font-[Georgia,'Times_New_Roman',serif] mt-8 max-w-none text-white/80"
            dangerouslySetInnerHTML={{ __html: marked.parse(post.body) as string }}
          />
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
