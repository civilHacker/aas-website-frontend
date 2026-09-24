export type ShelfId = "arabic" | "sufism" | "islamic";

export type InsightKind = "points" | "commentary" | "quotes";

export type BookInsight = {
  kind: InsightKind;
  text: string;
  /** Extra paragraphs shown after `text` in the points/commentary popup. */
  detail?: string[];
  page?: string;
  chapter?: string;
};

export const insightFilters: { id: InsightKind | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "points", label: "Points" },
  { id: "commentary", label: "Commentary" },
  { id: "quotes", label: "Quotes" },
];

export const shelves: { id: ShelfId | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "arabic", label: "Arabic" },
  { id: "sufism", label: "Sufism" },
  { id: "islamic", label: "Islamic" },
];

export type LibraryBook = {
  id: string;
  title: string;
  author: string;
  year: string;
  category: string;
  /** Filter shelf; books without one only appear under "All". */
  shelf?: ShelfId;
  /** Out of 5; defaults to 5. */
  rating?: number;
  /** Short badge beside the rating; defaults to "Highly Recommend". */
  verdict?: string;
  /** Cards for the "Insights & Quotes" grid; falls back to the synopsis and excerpt. */
  insights?: BookInsight[];
  synopsis: string;
  excerpt: string;
  /** Cloth colour of boards and spine. Keep these muted. */
  cloth: string;
  /** Foil colour used for stamped lettering and rules. */
  foil: string;
  /** Book size in scene units: cover width, height, thickness. */
  width: number;
  height: number;
  thickness: number;
};

const GILT = "#c9a96a";
const CREAM = "#e8dcc2";
const INK = "#2a2118";

export const libraryBooks: LibraryBook[] = [
  {
    id: "zero-to-one",
    title: "Zero to One",
    author: "Peter Thiel",
    year: "2014",
    category: "Company Building",
    synopsis:
      "A short, contrarian argument that real progress comes from building something new rather than copying what already works — and that the best businesses are monopolies of their own making.",
    excerpt: "Every moment in business happens only once.",
    cloth: "#2f2f33",
    foil: GILT,
    width: 1.28,
    height: 1.92,
    thickness: 0.3,
  },
  {
    id: "hard-thing",
    title: "The Hard Thing About Hard Things",
    author: "Ben Horowitz",
    year: "2014",
    category: "Leadership",
    synopsis:
      "An operator's account of the parts of running a company no one prepares you for: layoffs, demotions, near-bankruptcy, and the loneliness of making the call.",
    excerpt:
      "The hard thing isn't setting a big, hairy, audacious goal. The hard thing is laying people off when you miss the big goal.",
    cloth: "#5c1f2a",
    foil: GILT,
    width: 1.36,
    height: 2.06,
    thickness: 0.4,
  },
  {
    id: "thinking-fast-slow",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    year: "2011",
    category: "Decision Making",
    synopsis:
      "A tour of the two systems that drive how we think — one fast and intuitive, one slow and deliberate — and the predictable ways both lead us astray.",
    excerpt:
      "Nothing in life is as important as you think it is, while you are thinking about it.",
    cloth: "#4a5560",
    foil: CREAM,
    width: 1.42,
    height: 2.18,
    thickness: 0.5,
  },
  {
    id: "shoe-dog",
    title: "Shoe Dog",
    author: "Phil Knight",
    year: "2016",
    category: "Memoir",
    synopsis:
      "The founder of Nike on the early, fragile, borrowed-money years — a memoir about stubbornness, partnership, and staying in the game long enough to win it.",
    excerpt:
      "Let everyone else call your idea crazy… just keep going. Don't stop.",
    cloth: "#a0543a",
    foil: CREAM,
    width: 1.32,
    height: 2.0,
    thickness: 0.42,
  },
  {
    id: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    year: "c. 180",
    category: "Philosophy",
    synopsis:
      "Private notes an emperor wrote to himself on duty, mortality, and self-command — never meant for publication, and more useful because of it.",
    excerpt:
      "You have power over your mind — not outside events. Realize this, and you will find strength.",
    cloth: "#2f4a3a",
    foil: GILT,
    width: 1.18,
    height: 1.8,
    thickness: 0.34,
  },
  {
    id: "innovators-dilemma",
    title: "The Innovator's Dilemma",
    author: "Clayton M. Christensen",
    year: "1997",
    category: "Strategy",
    synopsis:
      "Why well-run companies that listen to their best customers still get displaced — and how disruptive technologies grow up in the markets incumbents ignore.",
    excerpt:
      "Good management was the most powerful reason they failed to stay atop their industries.",
    cloth: "#b08a3e",
    foil: INK,
    width: 1.4,
    height: 2.12,
    thickness: 0.38,
  },
  {
    id: "making-of-prince",
    title: "The Making of Prince",
    author: "Prince",
    year: "2019",
    category: "Craft",
    synopsis:
      "Handwritten pages, early photographs, and an unfinished memoir from an artist who guarded his process closely — a rare look at how a singular body of work began.",
    excerpt:
      "The book I come back to more than any other. Written for no one but himself.",
    cloth: "#3a2a2f",
    foil: GILT,
    width: 1.46,
    height: 2.04,
    thickness: 0.46,
  },
  {
    id: "sapiens",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    year: "2011",
    category: "History",
    synopsis:
      "A brisk history of humankind built around one idea: that our species conquered the world because we can cooperate flexibly around stories we all agree to believe.",
    excerpt:
      "You could never convince a monkey to give you a banana by promising him limitless bananas after death in monkey heaven.",
    cloth: "#5a3e2b",
    foil: CREAM,
    width: 1.38,
    height: 2.14,
    thickness: 0.48,
  },
  {
    id: "principles",
    title: "Principles",
    author: "Ray Dalio",
    year: "2017",
    category: "Operating Systems",
    synopsis:
      "A founder's operating manual: write down how you make decisions, test those rules against reality, and let a culture of radical transparency refine them.",
    excerpt: "Pain + Reflection = Progress.",
    cloth: "#3b3f45",
    foil: GILT,
    width: 1.44,
    height: 2.2,
    thickness: 0.52,
  },
  {
    id: "the-alchemist",
    title: "The Alchemist",
    author: "Paulo Coelho",
    year: "1988",
    category: "Fiction",
    synopsis:
      "A shepherd crosses the desert in search of treasure and learns to read the omens along the way — a short fable about following the thing you were meant to do.",
    excerpt:
      "When you want something, all the universe conspires in helping you to achieve it.",
    cloth: "#8c6a3f",
    foil: CREAM,
    width: 1.16,
    height: 1.78,
    thickness: 0.28,
  },
  {
    id: "good-to-great",
    title: "Good to Great",
    author: "Jim Collins",
    year: "2001",
    category: "Management",
    synopsis:
      "A research-driven study of the few companies that made the leap from average to enduring greatness, and the unglamorous disciplines they shared.",
    excerpt: "Good is the enemy of great.",
    cloth: "#6b2c2c",
    foil: GILT,
    width: 1.34,
    height: 2.02,
    thickness: 0.4,
  },
  {
    id: "lean-startup",
    title: "The Lean Startup",
    author: "Eric Ries",
    year: "2011",
    category: "Product",
    synopsis:
      "Treat a startup as an experiment: ship the smallest thing that tests your riskiest assumption, measure what happens, and learn faster than the money runs out.",
    excerpt: "The only way to win is to learn faster than anyone else.",
    cloth: "#3d4a3f",
    foil: CREAM,
    width: 1.3,
    height: 1.96,
    thickness: 0.36,
  },
  {
    id: "season-of-migration",
    title: "Season of Migration to the North",
    author: "Tayeb Salih",
    year: "1966",
    category: "Arabic Fiction",
    shelf: "arabic",
    synopsis:
      "A young Sudanese man returns home from Europe and meets a stranger whose London past quietly dismantles the romance between coloniser and colonised.",
    excerpt:
      "It was, gentlemen, after a long absence — seven years to be exact, during which time I was studying in Europe — that I returned to my people.",
    cloth: "#2f4a3a",
    foil: GILT,
    width: 1.3,
    height: 2.0,
    thickness: 0.34,
  },
  {
    id: "the-prophet",
    title: "The Prophet",
    author: "Kahlil Gibran",
    year: "1923",
    category: "Arabic Literature",
    shelf: "arabic",
    synopsis:
      "Before boarding the ship that will carry him home, a prophet answers the townspeople's questions on love, work, children, and death in twenty-six prose poems.",
    excerpt:
      "Your children are not your children. They are the sons and daughters of Life's longing for itself.",
    cloth: "#5c1f2a",
    foil: GILT,
    width: 1.2,
    height: 1.82,
    thickness: 0.28,
  },
  {
    id: "men-in-the-sun",
    title: "Men in the Sun",
    author: "Ghassan Kanafani",
    year: "1962",
    category: "Arabic Fiction",
    shelf: "arabic",
    synopsis:
      "Three Palestinian men try to cross the desert into Kuwait hidden in an empty water tank — a short, unforgiving novella about exile and silence.",
    excerpt: "Why didn't you knock on the sides of the tank?",
    cloth: "#a0543a",
    foil: CREAM,
    width: 1.18,
    height: 1.84,
    thickness: 0.3,
  },
  {
    id: "masnavi",
    title: "The Masnavi",
    author: "Jalal al-Din Rumi",
    year: "c. 1273",
    category: "Sufi Poetry",
    shelf: "sufism",
    synopsis:
      "Rumi's six-book spiritual epic — stories within stories, parables and couplets — on longing, love, and the soul's return to its source.",
    excerpt:
      "Listen to the reed how it tells a tale, complaining of separations.",
    cloth: "#3a2a2f",
    foil: GILT,
    width: 1.44,
    height: 2.2,
    thickness: 0.52,
  },
  {
    id: "forty-rules",
    title: "The Forty Rules of Love",
    author: "Elif Shafak",
    year: "2010",
    category: "Sufism",
    shelf: "sufism",
    synopsis:
      "A modern marriage and the thirteenth-century friendship between Rumi and the wandering dervish Shams of Tabriz, told side by side.",
    excerpt: "How we see God is a direct reflection of how we see ourselves.",
    cloth: "#b08a3e",
    foil: INK,
    width: 1.32,
    height: 2.02,
    thickness: 0.4,
  },
  {
    id: "alchemy-of-happiness",
    title: "The Alchemy of Happiness",
    author: "Al-Ghazali",
    year: "c. 1105",
    category: "Sufism",
    shelf: "sufism",
    synopsis:
      "Al-Ghazali's concise guide to knowing the self, knowing God, and turning ordinary life into a discipline of the heart.",
    excerpt:
      "Know, O beloved, that man was not created in jest or at random, but marvellously made and for some great end.",
    cloth: "#4a5560",
    foil: CREAM,
    width: 1.24,
    height: 1.9,
    thickness: 0.32,
  },
  {
    id: "muqaddimah",
    title: "The Muqaddimah",
    author: "Ibn Khaldun",
    year: "1377",
    category: "Islamic History",
    shelf: "islamic",
    synopsis:
      "An introduction to history that became a founding text of sociology — on how dynasties rise on group solidarity and fall when it erodes.",
    excerpt:
      "The past resembles the future more than one drop of water resembles another.",
    cloth: "#5a3e2b",
    foil: GILT,
    width: 1.42,
    height: 2.16,
    thickness: 0.5,
  },
  {
    id: "road-to-mecca",
    title: "The Road to Mecca",
    author: "Muhammad Asad",
    year: "1954",
    category: "Islamic Thought",
    shelf: "islamic",
    synopsis:
      "A Viennese journalist crosses the Arabian desert and recounts the journey that led him to Islam — travelogue, memoir, and argument at once.",
    excerpt: "Islam appeared to me like a perfect work of architecture.",
    cloth: "#3b3f45",
    foil: GILT,
    width: 1.34,
    height: 2.06,
    thickness: 0.42,
  },
  {
    id: "travels-ibn-battuta",
    title: "The Travels of Ibn Battuta",
    author: "Ibn Battuta",
    year: "1355",
    category: "Islamic History",
    shelf: "islamic",
    synopsis:
      "Three decades on the road from Tangier to China — the most ambitious travel account of the medieval Islamic world.",
    excerpt:
      "Traveling — it leaves you speechless, then turns you into a storyteller.",
    cloth: "#6b2c2c",
    foil: CREAM,
    width: 1.3,
    height: 1.98,
    thickness: 0.38,
  },
];

export function buyLink(book: LibraryBook) {
  return `https://bookshop.org/search?keywords=${encodeURIComponent(`${book.title} ${book.author}`)}`;
}

export function storeLinks(book: LibraryBook) {
  const q = encodeURIComponent(`${book.title} ${book.author}`);
  return {
    amazon: `https://www.amazon.com/s?k=${q}&i=stripbooks`,
    kindle: `https://www.amazon.com/s?k=${q}&i=digital-text`,
  };
}

export function insightsFor(book: LibraryBook): BookInsight[] {
  return (
    book.insights ?? [
      { kind: "commentary", text: book.synopsis },
      { kind: "quotes", text: book.excerpt },
    ]
  );
}
