import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type Award = {
  id: string;
  title: string;
  by: string;
  year: string;
};

export async function getAwards(): Promise<Award[]> {
  const { data, error } = await createAdminClient()
    .from("achievements")
    .select("id, title, description, year")
    .order("year", { ascending: false })
    .order("created_at", { ascending: false })
    .returns<
      { id: string; title: string; description: string; year: string }[]
    >();

  if (error) {
    console.error("Loading awards failed:", error.message);
    return [];
  }

  return data.map(({ id, title, description, year }) => ({
    id,
    title,
    by: description,
    year,
  }));
}
