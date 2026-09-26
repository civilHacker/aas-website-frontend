"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { libraryBooks, shelves, type LibraryBook } from "./books";

type Art = Record<string, { cover: string; spine: string }>;

const SERIF = "font-[Georgia,'Times_New_Roman',serif]";

function ShelfBook({
  book,
  art,
  facing,
  order,
  onPick,
}: {
  book: LibraryBook;
  art?: { cover: string; spine: string };
  facing: boolean;
  order: number;
  onPick: () => void;
}) {
  const width = facing ? book.width : book.thickness * 1.15;
  const src = facing ? art?.cover : art?.spine;
  return (
    <li
      className="library-overview-book shrink-0"
      style={{ "--i": order } as CSSProperties}
    >
      <button
        type="button"
        onClick={onPick}
        aria-label={`Open ${book.title} by ${book.author}`}
        title={book.title}
        className="group block origin-bottom transition-transform duration-300 hover:-translate-y-2 focus-visible:-translate-y-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        style={{
          width: `calc(var(--u) * ${width})`,
          height: `calc(var(--u) * ${book.height})`,
        }}
      >
        <span
          className="relative block size-full overflow-hidden rounded-[2px] shadow-[3px_0_6px_rgba(0,0,0,0.45),inset_-1px_0_0_rgba(0,0,0,0.35)]"
          style={{ backgroundColor: book.cloth }}
        >
          {src && (
            // eslint-disable-next-line @next/next/no-img-element -- generated data URL, nothing for next/image to optimise
            <img
              src={src}
              alt=""
              className="size-full object-fill"
              draggable={false}
            />
          )}
          <span className="absolute inset-0 bg-linear-to-r from-black/25 via-transparent to-black/20" />
        </span>
      </button>
    </li>
  );
}

export function ShelfOverview({
  open,
  onPick,
}: {
  open: boolean;
  onPick: (index: number) => void;
}) {
  const [art, setArt] = useState<Art>({});

  const rows = useMemo(
    () =>
      shelves
        .filter((s) => s.id !== "all")
        .map((s) => ({
          ...s,
          books: libraryBooks
            .map((book, index) => ({ book, index }))
            .filter(({ book }) => book.shelf === s.id),
        })),
    [],
  );

  useEffect(() => {
    if (!open || Object.keys(art).length > 0) return;
    let cancelled = false;
    import("./bookTextures").then(({ renderCoverImage, renderSpineImage }) => {
      if (cancelled) return;
      const next: Art = {};
      for (const { books } of rows)
        for (const { book } of books)
          next[book.id] = {
            cover: renderCoverImage(book),
            spine: renderSpineImage(book),
          };
      setArt(next);
    });
    return () => {
      cancelled = true;
    };
  }, [open, art, rows]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="All shelves"
      aria-hidden={!open}
      inert={!open}
      data-open={open}
      className="library-overview absolute inset-0 z-40 flex flex-col overflow-x-hidden overflow-y-auto bg-[radial-gradient(120%_90%_at_50%_40%,#1c0b06_0%,#0d0402_60%,#050100_100%)] [--u:clamp(50px,8.5svh,110px)]"
    >
      <h2
        className={`${SERIF} shrink-0 px-5 pt-28 pr-20 text-[34px] leading-[1.05] tracking-[-0.02em] text-white sm:px-10 sm:pt-32 sm:text-[44px] lg:px-[42px] lg:text-[52px]`}
      >
        The Founder’s Shelf
      </h2>

      <div className="flex flex-1 flex-col justify-evenly gap-8 pt-4 pb-10 sm:pb-[118px]">
        {rows.map((row, r) => {
          const facing = Math.floor(row.books.length / 2);
          return (
            <section key={row.id} aria-label={`${row.label} shelf`}>
              <div className="flex items-end gap-4 px-5 sm:px-10 lg:px-[42px]">
                <h3
                  className={`${SERIF} w-[30%] shrink-0 self-center text-[26px] leading-none text-white sm:w-[34%] sm:text-[36px] lg:w-[40%] lg:text-[44px]`}
                >
                  {row.label}
                </h3>
                {row.books.length > 0 ? (
                  <ul className="-mb-px flex min-w-0 flex-1 items-end justify-end gap-[2px] overflow-x-auto pt-3 [scrollbar-width:none]">
                    {row.books.map(({ book, index }, i) => (
                      <ShelfBook
                        key={book.id}
                        book={book}
                        art={art[book.id]}
                        facing={i === facing}
                        order={r * 4 + i}
                        onPick={() => onPick(index)}
                      />
                    ))}
                  </ul>
                ) : (
                  <p className="flex-1 pb-4 text-right text-sm text-white/45">
                    No books on this shelf yet.
                  </p>
                )}
              </div>
              <div
                aria-hidden
                className="relative h-[calc(var(--u)*0.34)] min-h-4 bg-[linear-gradient(180deg,#e0a86c_0%,#b87c45_10%,#94592b_45%,#6b3c19_80%,#4a260e_100%)] shadow-[0_22px_30px_-6px_rgba(0,0,0,0.75)]"
              >
                <span className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(60,25,5,0.14)_0_1px,transparent_1px_7px,rgba(255,210,160,0.06)_7px_9px,transparent_9px_23px)]" />
                <span className="absolute inset-x-0 top-0 h-px bg-[#ffd9a8]/60" />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
