export type FeaturedKind = "article" | "press" | "podcast" | "talk";

export type FeaturedItem = {
  id: string;
  kind: FeaturedKind;
  title: string;
  /** Reading, listening or watching time, e.g. "8 min". */
  duration: string;
  image: string;
  href: string;
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

export const featuredItems: FeaturedItem[] = [
  {
    id: "abdallah-of-arabia",
    kind: "article",
    title:
      "Meet Abdallah Of Arabia: The Serial Entrepreneur Behind UAE's Barq & Rizek",
    duration: "8 min",
    image: "/images/featured/card-1.png",
    href: "#",
  },
  {
    id: "abdallah-of-arabia-2",
    kind: "article",
    title:
      "Meet Abdallah Of Arabia: The Serial Entrepreneur Behind UAE's Barq & Rizek",
    duration: "8 min",
    image: "/images/featured/card-2.png",
    href: "#",
  },
  {
    id: "abdallah-of-arabia-3",
    kind: "article",
    title:
      "Meet Abdallah Of Arabia: The Serial Entrepreneur Behind UAE's Barq & Rizek",
    duration: "8 min",
    image: "/images/featured/card-3.png",
    href: "#",
  },
];
