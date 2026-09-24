import "server-only";
import {
  kindFromCategory,
  type FeaturedItem,
} from "@/components/featured/items";
import { createAdminClient } from "@/lib/supabase/admin";

type FeaturedRow = {
  id: string;
  title: string;
  category: string;
  description: string;
  link: string | null;
  image_url: string | null;
};

const httpUrl = (value: string | null) => {
  const url = value?.trim();
  return url && /^https?:\/\//i.test(url) ? url : null;
};

export async function getFeaturedItems(): Promise<FeaturedItem[]> {
  const { data, error } = await createAdminClient()
    .from("featured")
    .select("id, title, category, description, link, image_url")
    .order("created_at", { ascending: false })
    .returns<FeaturedRow[]>();

  if (error) {
    console.error("Loading featured items failed:", error.message);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    kind: kindFromCategory(row.category),
    title: row.title,
    description: row.description,
    image: httpUrl(row.image_url),
    href: httpUrl(row.link),
  }));
}
