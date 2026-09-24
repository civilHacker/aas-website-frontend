export type FeaturedKind = "article" | "press" | "podcast" | "talk";

export type FeaturedItem = {
  id: string;
  kind: FeaturedKind | null;
  title: string;
  description: string;
  image: string | null;
  href: string | null;
};

export const featuredFilters: { id: FeaturedKind | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "article", label: "Articles" },
  { id: "press", label: "Press" },
  { id: "podcast", label: "Podcasts" },
  { id: "talk", label: "Talks" },
];

export const kindLabels: Record<FeaturedKind, string> = {
  article: "Article",
  press: "Press",
  podcast: "Podcast",
  talk: "Talk",
};

const kindsByCategory: Record<string, FeaturedKind> = {
  article: "article",
  articles: "article",
  press: "press",
  podcast: "podcast",
  podcasts: "podcast",
  talk: "talk",
  talks: "talk",
};

/** Maps the admin panel's category ("Articles", "Press", …) onto a filter. */
export function kindFromCategory(category: string): FeaturedKind | null {
  return kindsByCategory[category.trim().toLowerCase()] ?? null;
}
