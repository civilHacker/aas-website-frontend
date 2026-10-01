import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  body: string;
  image: string | null;
  createdAt: number;
};

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  body: string;
  image_url: string | null;
  created_at: number;
};

const httpUrl = (value: string | null) => {
  const url = value?.trim();
  return url && /^https?:\/\//i.test(url) ? url : null;
};

function toBlogPost(row: BlogRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    body: row.body,
    image: httpUrl(row.image_url),
    createdAt: row.created_at,
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await createAdminClient()
    .from("blog_posts")
    .select("id, title, slug, body, image_url, created_at")
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
    .select("id, title, slug, body, image_url, created_at")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle<BlogRow>();

  if (error || !data) {
    if (error) console.error("Loading blog post failed:", error.message);
    return null;
  }
  return toBlogPost(data);
}
