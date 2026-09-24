"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  insightFilters,
  insightsFor,
  storeLinks,
  type BookInsight,
  type InsightKind,
  type LibraryBook,
} from "./books";

const insightIcons: Record<InsightKind, { src: string; size: number }> = {
  commentary: { src: "/images/library/insights/icon-commentary.png", size: 34 },
  quotes: { src: "/images/library/insights/icon-quotes.png", size: 28 },
  points: { src: "/images/library/insights/icon-points.png", size: 28 },
};

const kindLabels: Record<InsightKind, string> = {
  points: "Points",
  commentary: "Commentary",
  quotes: "Quotes",
};

const CLAMP = 120;

function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-[opacity,translate] duration-700 ease-out motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

function insightMeta(book: LibraryBook, insight: BookInsight) {
  return {
    left: insight.page ?? book.category,
    right: insight.chapter ?? book.year,
  };
}

function InsightCard({
  book,
  insight,
  onOpen,
}: {
  book: LibraryBook;
  insight: BookInsight;
  onOpen: () => void;
}) {
  const icon = insightIcons[insight.kind];
  const long = insight.text.length > CLAMP || Boolean(insight.detail?.length);
  const text =
    insight.text.length > CLAMP
      ? `${insight.text.slice(0, CLAMP).trimEnd()}…`
      : insight.text;
  const meta = insightMeta(book, insight);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="flex h-full w-full flex-col gap-[27px] rounded-[27px] bg-white/10 px-6 py-[27px] text-left backdrop-blur-[20px] transition-colors duration-300 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-accent sm:px-7"
    >
      <span className="flex w-full items-start justify-between gap-4">
        <Image src={icon.src} alt="" width={icon.size} height={icon.size} />
        <span className="rounded-[27px] border border-accent/28 px-[11px] py-[3px] text-base leading-[1.28] text-white sm:text-[18px]">
          {kindLabels[insight.kind]}
        </span>
      </span>
      <span className="block flex-1 text-lg leading-[1.28] text-white sm:text-xl">
        {text}
        {long && (
          <span className="font-manrope font-semibold"> Read more...</span>
        )}
      </span>
      <span className="flex w-full justify-between gap-4 border-t border-white/32 pt-[11px] text-[15px] leading-[1.28] text-white/60 sm:text-[17px]">
        <span className="uppercase">{meta.left}</span>
        <span className="truncate">{meta.right}</span>
      </span>
    </button>
  );
}

function InsightDialog({
  book,
  insight,
  onClose,
}: {
  book: LibraryBook;
  insight: BookInsight | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (insight && !dialog.open) dialog.showModal();
    if (!insight && dialog.open) dialog.close();
  }, [insight]);

  const isQuote = insight?.kind === "quotes";
  const meta = insight ? insightMeta(book, insight) : null;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      onKeyDown={(e) => {
        if (e.key !== "Escape") return;
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.close();
      }}
      aria-labelledby="insight-dialog-label"
      className="library-dialog m-auto max-h-[85svh] w-[min(691px,calc(100vw-2rem))] max-w-none flex-col overflow-hidden rounded-[24px] border border-white/25 bg-black p-0 text-white shadow-[0_3px_22.8px_rgba(0,0,0,0.25)] backdrop:bg-black/45 backdrop:backdrop-blur-[10px] open:flex"
    >
      {insight && meta && (
        <>
          <header className="flex h-[59px] shrink-0 items-center justify-between border-b border-[#978787]/34 px-6 sm:px-[39px]">
            <span className="flex items-center gap-2">
              <Image
                src={insightIcons[insight.kind].src}
                alt=""
                width={isQuote ? 20 : 18}
                height={isQuote ? 20 : 18}
              />
              <span
                id="insight-dialog-label"
                className="text-[18px] leading-[1.28]"
              >
                {isQuote ? "Quote" : kindLabels[insight.kind]}
              </span>
            </span>
            <button
              type="button"
              aria-label="Close"
              onClick={() => ref.current?.close()}
              className="rounded-full transition-opacity hover:opacity-70"
            >
              <Image
                src="/images/library/insights/x-circle.svg"
                alt=""
                width={26}
                height={26}
              />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8 sm:px-[39px] sm:py-[38px]">
            {isQuote ? (
              <figure className="mx-auto flex max-w-[528px] flex-col items-center gap-[10px] text-center">
                <Image
                  src={insightIcons.quotes.src}
                  alt=""
                  width={69}
                  height={69}
                  className="size-12 sm:size-[69px]"
                />
                <blockquote className="font-[Georgia,'Times_New_Roman',serif] text-[26px] leading-[1.28] tracking-[-0.025em] italic sm:text-[37px]">
                  {insight.text}
                </blockquote>
                <figcaption className="sr-only">
                  {book.author}, {book.title}
                </figcaption>
              </figure>
            ) : (
              <div className="mx-auto max-w-[613px]">
                <h3 className="font-[Georgia,'Times_New_Roman',serif] text-2xl leading-[1.01] tracking-[-0.025em]">
                  {book.title}
                </h3>
                <div className="mt-[38px] space-y-6 font-manrope text-base leading-[1.4] sm:text-[18px]">
                  {[insight.text, ...(insight.detail ?? [])].map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          <footer className="flex h-[59px] shrink-0 items-center justify-between gap-4 border-t border-[#978787]/34 px-6 text-[15px] leading-[1.28] text-white/60 sm:px-[39px] sm:text-[17px]">
            <span className="uppercase">{meta.left}</span>
            <span className="truncate">{meta.right}</span>
          </footer>
        </>
      )}
    </dialog>
  );
}

function CoverArt({ book }: { book: LibraryBook }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("./bookTextures").then(({ renderCoverImage }) => {
      if (!cancelled) setSrc(renderCoverImage(book));
    });
    return () => {
      cancelled = true;
    };
  }, [book]);

  return (
    <div className="relative aspect-[293/433] w-[200px] -rotate-[9.55deg] sm:w-[240px] lg:w-[293px]">
      <div
        className="absolute inset-y-[0.6%] -left-[4%] w-[5%] rounded-l-[3px]"
        style={{ backgroundColor: book.foil }}
      />
      <div className="absolute inset-0 overflow-hidden rounded-r-[4px] rounded-l-[2px] bg-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.55)]">
        {src && (
          // eslint-disable-next-line @next/next/no-img-element -- generated data URL, nothing for next/image to optimise.
          <img
            src={src}
            alt={`Cover of ${book.title}`}
            className="size-full object-cover"
          />
        )}
        <div className="absolute inset-y-0 left-0 w-[6%] bg-linear-to-r from-black/35 to-transparent" />
      </div>
    </div>
  );
}

export function BookDetails({ book }: { book: LibraryBook }) {
  const [filter, setFilter] = useState<InsightKind | "all">("all");
  const [active, setActive] = useState<BookInsight | null>(null);
  const insights = insightsFor(book);
  const shown = insights.filter((i) => filter === "all" || i.kind === filter);
  const stores = storeLinks(book);

  return (
    <div className="bg-linear-to-b from-[#100604] to-black">
      <section
        aria-labelledby="insights-heading"
        className="page-container flex flex-col gap-8 pt-14 sm:gap-[45px] sm:pt-[70px]"
      >
        <Reveal className="flex flex-wrap items-center justify-between gap-5">
          <h2
            id="insights-heading"
            className="text-[30px] leading-[0.95] text-white sm:text-[39px]"
          >
            Insights &amp; Quotes
          </h2>
          <div
            role="group"
            aria-label="Filter insights"
            className="flex h-[51px] items-center gap-1 rounded-[19px] bg-white/20 p-2 backdrop-blur-[20px] sm:gap-2"
          >
            {insightFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`flex h-[35px] min-w-[58px] items-center justify-center rounded-[11px] px-3 text-[15px] leading-[1.119] whitespace-nowrap transition-colors duration-300 ${
                  filter === f.id
                    ? "bg-white text-black"
                    : "text-white hover:bg-white/15"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal>
          {shown.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((insight, i) => (
                <InsightCard
                  key={`${insight.kind}-${i}`}
                  book={book}
                  insight={insight}
                  onOpen={() => setActive(insight)}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-[27px] bg-white/10 px-7 py-10 text-center text-white/60">
              No {kindLabels[filter as InsightKind].toLowerCase()} for this book
              yet.
            </p>
          )}
        </Reveal>
      </section>

      <section
        aria-labelledby="copy-heading"
        className="page-container pt-16 pb-20 sm:pt-20 md:pt-24 lg:pt-[140px] lg:pb-28"
      >
        <Reveal className="relative flex flex-col items-center gap-10 rounded-[36px] bg-white/10 px-6 pt-10 pb-10 backdrop-blur-[20.7px] sm:px-10 lg:min-h-[378px] lg:flex-row lg:items-start lg:gap-0 lg:py-[55px] lg:pr-10 lg:pl-0">
          <div className="flex shrink-0 justify-center lg:absolute lg:-top-[49px] lg:left-[57px]">
            <CoverArt book={book} />
          </div>
          <div className="flex max-w-[565px] flex-col gap-2 text-center lg:ml-[50%] lg:text-left">
            <h2
              id="copy-heading"
              className="text-[38px] leading-[1.119] text-white sm:text-[52px] lg:text-[64px]"
            >
              Get Your Copy.
              <br />
              Read It Anywhere.
            </h2>
            <p className="mt-2 max-w-[538px] text-base leading-[1.46] text-white/60 lg:mt-6">
              Available worldwide. Choose your preferred store and get the book
              delivered or start reading digitally.
            </p>
            <div className="mt-3 flex justify-center gap-2 lg:justify-start">
              <a
                href={stores.amazon}
                target="_blank"
                rel="noreferrer"
                className="flex h-[51px] w-[137px] items-center justify-center gap-[10px] rounded-[14px] bg-accent px-[11px] font-manrope text-base leading-[1.3] font-medium text-black transition-transform hover:-translate-y-0.5"
              >
                Amazon
                <Image
                  src="/images/library/insights/arrow-up-right-dark.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              </a>
              <a
                href={stores.kindle}
                target="_blank"
                rel="noreferrer"
                className="flex h-[51px] w-[120px] items-center justify-center gap-[10px] rounded-[14px] bg-white/18 px-[11px] font-manrope text-base leading-[1.3] font-medium text-white transition-[translate,background-color] hover:-translate-y-0.5 hover:bg-white/25"
              >
                Kindle
                <Image
                  src="/images/library/insights/arrow-up-right-light.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <InsightDialog
        book={book}
        insight={active}
        onClose={() => setActive(null)}
      />
    </div>
  );
}
