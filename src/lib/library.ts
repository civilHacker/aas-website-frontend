import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  libraryBooks as fallbackBooks,
  type BookInsight,
  type InsightKind,
  type LibraryBook,
  type ShelfId,
} from "@/components/library/books";

type BookRow = {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  rating: number | null;
  recommendation: string | null;
  spine_color: string;
  buy_link: string | null;
  amazon_link: string | null;
  kindle_link: string | null;
  status?: string | null;
  created_at: number;
};

const BOOK_COLUMNS =
  "id, title, author, category, description, rating, recommendation, spine_color, buy_link, amazon_link, kindle_link, created_at";

/**
 * The "status" (Draft/Publish) column may not exist yet if its migration
 * hasn't run. Try selecting it; if that's specifically why the query fails,
 * fall back to the query without it so the whole site doesn't go dark.
 */
async function fetchBookRows(client: ReturnType<typeof createAdminClient>) {
  const withStatus = await client
    .from("books")
    .select(`${BOOK_COLUMNS}, status`)
    .order("created_at", { ascending: false })
    .returns<BookRow[]>();
  if (!withStatus.error) return withStatus;
  if (!/status/i.test(withStatus.error.message)) return withStatus;

  return client
    .from("books")
    .select(BOOK_COLUMNS)
    .order("created_at", { ascending: false })
    .returns<BookRow[]>();
}

type InsightRow = {
  book_id: string;
  type: string;
  title: string | null;
  description: string;
  page_number: string | null;
  section_number: string | null;
  written_by_aas: boolean | null;
  created_at: number;
};

const GILT = "#c9a96a";
const CREAM = "#e8dcc2";
const INK = "#2a2118";
const FOILS = [GILT, CREAM, INK];

/** width, height, thickness (scene units) — sampled from the shelf's hand-set proportions. */
const SIZES: [number, number, number][] = [
  [1.16, 1.78, 0.28],
  [1.18, 1.8, 0.3],
  [1.18, 1.84, 0.3],
  [1.2, 1.82, 0.28],
  [1.24, 1.9, 0.32],
  [1.28, 1.92, 0.3],
  [1.3, 1.96, 0.36],
  [1.3, 1.98, 0.38],
  [1.3, 2.0, 0.34],
  [1.32, 2.0, 0.42],
  [1.32, 2.02, 0.4],
  [1.34, 2.02, 0.4],
  [1.34, 2.06, 0.42],
  [1.36, 2.06, 0.4],
  [1.38, 2.14, 0.48],
  [1.4, 2.12, 0.38],
  [1.42, 2.16, 0.5],
  [1.42, 2.18, 0.5],
  [1.44, 2.2, 0.52],
  [1.46, 2.04, 0.46],
];

/** Deterministic 0..1 value per seed, so a book's foil/size never changes between renders. */
function hash(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

function shelfFromCategory(category: string): ShelfId | undefined {
  const c = category.toLowerCase();
  if (c.includes("arabic")) return "arabic";
  if (c.includes("sufi")) return "sufism";
  if (c.includes("islam")) return "islamic";
  return undefined;
}

/**
 * The admin panel only stores one free-form description. Splitting it on the
 * first sentence recovers a short pull-quote (`excerpt`) and the rest
 * (`synopsis`), the same two fields this shelf was designed around.
 */
function splitDescription(description: string) {
  const match = description.match(/^(.+?[.!?])\s+([\s\S]+)$/);
  if (match) return { excerpt: match[1], synopsis: match[2] };
  return { excerpt: description, synopsis: description };
}

function toBookInsight(row: InsightRow): BookInsight {
  const kind = row.type.toLowerCase() as InsightKind;
  const writtenByAAS = row.written_by_aas ?? kind !== "quotes";
  return {
    kind,
    // Commentary has its own title; lead with it, then the description as a
    // second paragraph. Points/Quotes have no title, so text is just the description.
    text: row.title ?? row.description,
    detail: row.title ? [row.description] : undefined,
    page: row.page_number ?? undefined,
    chapter: row.section_number ?? undefined,
    source: writtenByAAS ? "aas" : "book",
  };
}

function toLibraryBook(row: BookRow, insights?: BookInsight[]): LibraryBook {
  const { excerpt, synopsis } = splitDescription(row.description);
  const [width, height, thickness] =
    SIZES[Math.floor(hash(`${row.id}-size`) * SIZES.length)];
  const foil = FOILS[Math.floor(hash(`${row.id}-foil`) * FOILS.length)];

  return {
    id: row.id,
    title: row.title,
    author: row.author,
    year: new Date(row.created_at).getFullYear().toString(),
    category: row.category,
    shelf: shelfFromCategory(row.category),
    rating: row.rating ?? 5,
    verdict: row.recommendation ?? undefined,
    insights: insights?.length ? insights : undefined,
    synopsis,
    excerpt,
    buyLink: row.buy_link ?? undefined,
    amazonLink: row.amazon_link ?? undefined,
    kindleLink: row.kindle_link ?? undefined,
    cloth: row.spine_color,
    foil,
    width,
    height,
    thickness,
  };
}

/** Live from the admin panel's book library; falls back to the design fallback set if it's empty or unreachable. */
export async function getLibraryBooks(): Promise<LibraryBook[]> {
  const client = createAdminClient();
  const [booksResult, insightsResult] = await Promise.all([
    fetchBookRows(client),
    client
      .from("insights")
      .select(
        "book_id, type, title, description, page_number, section_number, written_by_aas, created_at",
      )
      .order("created_at", { ascending: true })
      .returns<InsightRow[]>(),
  ]);

  if (booksResult.error) {
    console.error("Loading library books failed:", booksResult.error.message);
    return fallbackBooks;
  }
  const publishedRows = booksResult.data.filter((row) => row.status !== "draft");
  if (publishedRows.length === 0) return fallbackBooks;

  if (insightsResult.error) {
    console.error("Loading book insights failed:", insightsResult.error.message);
  }

  const insightsByBook = new Map<string, BookInsight[]>();
  for (const row of insightsResult.data ?? []) {
    const list = insightsByBook.get(row.book_id) ?? [];
    list.push(toBookInsight(row));
    insightsByBook.set(row.book_id, list);
  }

  return publishedRows.map((row) =>
    toLibraryBook(row, insightsByBook.get(row.id)),
  );
}
