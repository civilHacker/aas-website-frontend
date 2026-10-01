import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type Problem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  body: string;
  featured: boolean;
  createdAt: number;
};

type ProblemRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[] | null;
  body: string;
  featured: boolean | null;
  created_at: number;
};

function toProblem(row: ProblemRow): Problem {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    tags: row.tags ?? [],
    body: row.body,
    featured: row.featured ?? false,
    createdAt: row.created_at,
  };
}

export async function getProblems(): Promise<Problem[]> {
  const { data, error } = await createAdminClient()
    .from("problems")
    .select("id, title, slug, category, tags, body, featured, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .returns<ProblemRow[]>();

  if (error) {
    console.error("Loading problems failed:", error.message);
    return [];
  }
  return data.map(toProblem);
}

export async function getProblemBySlug(slug: string): Promise<Problem | null> {
  const { data, error } = await createAdminClient()
    .from("problems")
    .select("id, title, slug, category, tags, body, featured, created_at")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle<ProblemRow>();

  if (error || !data) {
    if (error) console.error("Loading problem failed:", error.message);
    return null;
  }
  return toProblem(data);
}
