import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type MentorshipProgram = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  link: string | null;
  date: string | null;
  createdAt: number;
};

type MentorshipRow = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  link: string | null;
  date: string | null;
  created_at: number;
};

const httpUrl = (value: string | null) => {
  const url = value?.trim();
  return url && /^https?:\/\//i.test(url) ? url : null;
};

export async function getMentorshipPrograms(): Promise<MentorshipProgram[]> {
  const { data, error } = await createAdminClient()
    .from("mentorship_programs")
    .select("id, title, description, image_url, link, date, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .returns<MentorshipRow[]>();

  if (error) {
    console.error("Loading mentorship programs failed:", error.message);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    image: httpUrl(row.image_url),
    link: httpUrl(row.link),
    date: row.date,
    createdAt: row.created_at,
  }));
}
