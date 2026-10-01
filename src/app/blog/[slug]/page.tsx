import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/home/SiteFooter";
import { PageHeader } from "@/components/home/PageHeader";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { getBlogPostBySlug } from "@/lib/blog";
import { renderMarkdownWithToc } from "@/lib/markdown";

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

  const { html, toc } = renderMarkdownWithToc(post.body);

  return (
    <>
      <main className="flex-1 bg-black px-4 pb-24">
        <PageHeader active="blog" />
        <div className="mx-auto flex max-w-[1040px] items-start gap-12 pt-16">
          <article className="min-w-0 max-w-[760px] flex-1">
            <h1 className="font-[Georgia,'Times_New_Roman',serif] text-[36px] leading-[1.1] text-white sm:text-[48px]">
              {post.title}
            </h1>
            {post.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.image}
                alt=""
                className="mt-8 aspect-video w-full rounded-[16px] object-cover"
              />
            ) : null}
            <div
              className="prose prose-invert prose-headings:font-[Georgia,'Times_New_Roman',serif] prose-headings:scroll-mt-28 mt-8 max-w-none text-white/80"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </article>
          <TableOfContents toc={toc} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
