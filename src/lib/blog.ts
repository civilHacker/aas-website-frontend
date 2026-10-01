import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  body: string;
  createdAt: number;
};

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  body: string;
  created_at: number;
};

function toBlogPost(row: BlogRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    body: row.body,
    createdAt: row.created_at,
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await createAdminClient()
    .from("blog_posts")
    .select("id, title, slug, body, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .returns<BlogRow[]>();

  if (error) {
    console.error("Loading blog posts failed:", error.message);
    return [];
  }
  return data.map(toBlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await createAdminClient()
    .from("blog_posts")
    .select("id, title, slug, body, created_at")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle<BlogRow>();

  if (error || !data) {
    if (error) console.error("Loading blog post failed:", error.message);
    return null;
  }
  return toBlogPost(data);
}
