import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type Writing = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  createdAt: number;
};

type WritingRow = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  created_at: number;
};

const httpUrl = (value: string | null) => {
  const url = value?.trim();
  return url && /^https?:\/\//i.test(url) ? url : null;
};

export async function getWritings(): Promise<Writing[]> {
  const { data, error } = await createAdminClient()
    .from("writings")
    .select("id, title, description, image_url, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .returns<WritingRow[]>();

  if (error) {
    console.error("Loading writings failed:", error.message);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    image: httpUrl(row.image_url),
    createdAt: row.created_at,
  }));
}
