"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
  type WheelEvent,
} from "react";
import { BookDetails } from "./BookDetails";
import type { ShelfController } from "./BookshelfScene";
import { ShelfOverview } from "./ShelfOverview";
import { buyLink, libraryBooks, shelves, type ShelfId } from "./books";

const BookshelfScene = dynamic(() => import("./BookshelfScene"), {
  ssr: false,
});

const TITLE = "The Founder’s Shelf";
const INITIAL_SLOT = Math.floor((libraryBooks.length - 1) / 2);

const glass =
  "border border-white/10 bg-white/20 text-white backdrop-blur-[20px] transition-[opacity,background-color,color] hover:bg-white hover:text-black";

export function LibrarySection({ header }: { header: ReactNode }) {
  const [filter, setFilter] = useState<ShelfId | "all">("all");
  const [centered, setCentered] = useState(INITIAL_SLOT);
  const [selected, setSelected] = useState<number | null>(null);
  const [panelVisible, setPanelVisible] = useState(false);
  const [overview, setOverview] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const snapTimer = useRef<number | undefined>(undefined);
  const drag = useRef<{ x: number; start: number } | null>(null);
  const controller = useRef<ShelfController>({
    target: INITIAL_SLOT,
    display: INITIAL_SLOT,
    selected: null,
    opening: false,
    openT: 0,
    hovered: null,
    dragMoved: false,
    reducedMotion: false,
    visible: libraryBooks.map(() => true),
  });

  const visibleBooks = useMemo(
    () =>
      libraryBooks
        .map((book, index) => ({ book, index }))
        .filter(({ book }) => filter === "all" || book.shelf === filter),
    [filter],
  );
  const slotCount = visibleBooks.length;
  const lastSlot = Math.max(0, slotCount - 1);
  const slotCountRef = useRef(slotCount);

  useEffect(() => {
    slotCountRef.current = slotCount;
    const c = controller.current;
    c.reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    c.onDisplay = (display) => {
      const last = Math.max(1, slotCountRef.current - 1);
      if (thumbRef.current)
        thumbRef.current.style.left = `${(display / last) * 100}%`;
    };
    return () => {
      c.onDisplay = undefined;
    };
  }, [slotCount]);

  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement) setOverview(false);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const clampSlot = useCallback(
    (v: number) => Math.min(slotCountRef.current - 1, Math.max(0, v)),
    [],
  );

  const snap = useCallback(() => {
    const c = controller.current;
    c.target = clampSlot(Math.round(c.target));
  }, [clampSlot]);

  const step = useCallback(
    (delta: number) => {
      const c = controller.current;
      if (c.selected !== null) return;
      c.target = clampSlot(Math.round(c.target) + delta);
    },
    [clampSlot],
  );

  const open = useCallback((index: number) => {
    const c = controller.current;
    if (c.selected === index) {
      c.opening = !c.opening;
      if (!c.opening) setPanelVisible(false);
      return;
    }
    if (c.selected !== null || !c.visible[index]) return;
    c.selected = index;
    c.opening = true;
    c.openT = 0;
    c.target = c.visible.slice(0, index).filter(Boolean).length;
    c.hovered = null;
    document.body.style.cursor = "";
    setSelected(index);
  }, []);

  const close = useCallback(() => {
    const c = controller.current;
    if (c.selected === null || !c.opening) return;
    c.opening = false;
    setPanelVisible(false);
  }, []);

  const handleClosed = useCallback(() => setSelected(null), []);

  const chooseShelf = (id: ShelfId | "all") => {
    const c = controller.current;
    if (c.selected !== null || id === filter) return;
    c.visible = libraryBooks.map((b) => id === "all" || b.shelf === id);
    const count = c.visible.filter(Boolean).length;
    slotCountRef.current = count;
    c.target = Math.floor((count - 1) / 2);
    setFilter(id);
  };

  const closeOverview = useCallback(() => {
    setOverview(false);
    if (document.fullscreenElement) void document.exitFullscreen();
  }, []);

  const toggleOverview = () => {
    if (overview) return closeOverview();
    if (controller.current.selected !== null) return;
    setOverview(true);
    // Fullscreen is a bonus; iOS Safari has no element fullscreen, so the overview still fills the section.
    sectionRef.current?.requestFullscreen?.().catch(() => {});
  };

  const pickFromOverview = (index: number) => {
    closeOverview();
    const shelf = libraryBooks[index].shelf;
    if (shelf && shelf !== filter) chooseShelf(shelf);
    open(index);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (document.querySelector("dialog[open]")) return;
        if (overview) return closeOverview();
        close();
        return;
      }
      if (overview) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']"))
        return;
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return;
      event.preventDefault();
      step(event.key === "ArrowLeft" ? -1 : 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, closeOverview, overview, step]);

  const onStagePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const c = controller.current;
    c.dragMoved = false;
    if (c.selected !== null || event.button !== 0) return;
    drag.current = { x: event.clientX, start: c.target };
    const perBook = Math.max(60, event.currentTarget.clientWidth / 11);

    const onMove = (e: globalThis.PointerEvent) => {
      if (!drag.current) return;
      const dx = e.clientX - drag.current.x;
      if (Math.abs(dx) > 6) c.dragMoved = true;
      if (c.dragMoved) c.target = clampSlot(drag.current.start - dx / perBook);
    };
    const onUp = () => {
      drag.current = null;
      if (c.dragMoved) snap();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const onStageWheel = (event: WheelEvent<HTMLDivElement>) => {
    const c = controller.current;
    if (c.selected !== null || Math.abs(event.deltaX) <= Math.abs(event.deltaY))
      return;
    c.target = clampSlot(c.target + event.deltaX / 110);
    window.clearTimeout(snapTimer.current);
    snapTimer.current = window.setTimeout(snap, 160);
  };

  const setFromTrack = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    controller.current.target = clampSlot(
      ((clientX - rect.left) / rect.width) * lastSlot,
    );
  };

  const onTrackPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (controller.current.selected !== null) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setFromTrack(event.clientX);
  };

  const book = selected !== null ? libraryBooks[selected] : null;
  const facing = libraryBooks[centered] ?? visibleBooks[0]?.book;
  const facingSlot = visibleBooks.findIndex(({ index }) => index === centered);
  const isOpen = selected !== null;

  return (
    <>
      <section
        ref={sectionRef}
        aria-label="The Founder’s Shelf, an interactive bookshelf"
        className="library-room relative isolate h-svh min-h-[680px] w-full overflow-hidden bg-black"
      >
        <Image
          src="/images/library/founders-shelf-bg.png"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="object-cover"
        />
        <div className="library-veil pointer-events-none absolute inset-0" />
        <div
          className={`pointer-events-none absolute inset-0 bg-(--lib-base) transition-opacity duration-700 ${isOpen ? "opacity-50" : "opacity-0"}`}
        />

        <div
          className="absolute inset-0 touch-pan-y select-none"
          onPointerDown={onStagePointerDown}
          onWheel={onStageWheel}
        >
          <BookshelfScene
            books={libraryBooks}
            controller={controller}
            onSelect={open}
            onCenteredChange={setCentered}
            onPanelChange={setPanelVisible}
            onClosed={handleClosed}
          />
        </div>

        <div className="library-grain pointer-events-none absolute -inset-1/2" />

        <div className="absolute inset-x-0 top-0 z-30">{header}</div>

        <div
          className={`pointer-events-none absolute inset-x-0 top-[max(120px,18%)] z-10 flex flex-col items-center gap-[14px] px-5 text-center transition-[opacity,transform] duration-700 ${
            isOpen ? "-translate-y-3 opacity-0" : ""
          }`}
        >
          <h1
            aria-label={TITLE}
            className="library-flip font-[Georgia,'Times_New_Roman',serif] text-[40px] leading-[1.01] tracking-[-0.025em] text-white sm:text-[56px] lg:text-[69px]"
          >
            {TITLE.split(" ").map((word, w, words) => {
              const offset =
                words.slice(0, w).join(" ").length + (w > 0 ? 1 : 0);
              return (
                <span
                  key={word}
                  aria-hidden
                  className="inline-block whitespace-nowrap"
                >
                  {[...word].map((ch, i) => (
                    <span
                      key={i}
                      className="library-flip-letter"
                      style={{ animationDelay: `${700 + (offset + i) * 38}ms` }}
                    >
                      {ch}
                    </span>
                  ))}
                  {w < words.length - 1 && "\u00a0"}
                </span>
              );
            })}
          </h1>
          <div
            role="group"
            aria-label="Filter shelf"
            className="library-fade pointer-events-auto flex h-[51px] items-center gap-1 rounded-[13px] bg-white/20 py-2 pr-2 pl-2 backdrop-blur-[20px] sm:gap-2"
          >
            {shelves.map((shelf) => (
              <button
                key={shelf.id}
                type="button"
                aria-pressed={filter === shelf.id}
                onClick={() => chooseShelf(shelf.id)}
                className={`flex h-[35px] min-w-[58px] items-center justify-center rounded-[11px] px-3 text-[15px] leading-[1.119] whitespace-nowrap transition-colors duration-300 ${
                  filter === shelf.id
                    ? "bg-white text-black"
                    : "text-white hover:bg-white/15"
                }`}
              >
                {shelf.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 px-5 pb-6 transition-[opacity,transform] duration-600 sm:pb-8 ${
            isOpen
              ? "pointer-events-none translate-y-4 opacity-0"
              : "library-fade"
          }`}
        >
          {facing && (
            <p className="text-center text-white" aria-live="polite">
              <span className="font-serif text-xl italic sm:text-2xl">
                {facing.title}
              </span>
              <span className="ml-2 text-xs text-white/65 sm:text-sm">
                {facing.author}
              </span>
            </p>
          )}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              aria-label="Previous book"
              onClick={() => step(-1)}
              className={`grid size-10 place-items-center rounded-[11px] ${glass}`}
            >
              <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
                <path
                  d="M10 3L5 8l5 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
            <div
              ref={trackRef}
              role="slider"
              tabIndex={0}
              aria-label="Browse the shelf"
              aria-valuemin={1}
              aria-valuemax={slotCount}
              aria-valuenow={facingSlot + 1}
              aria-valuetext={
                facing ? `${facing.title} by ${facing.author}` : ""
              }
              onPointerDown={onTrackPointerDown}
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId))
                  setFromTrack(e.clientX);
              }}
              onPointerUp={snap}
              onPointerCancel={snap}
              onKeyDown={(e) => {
                if (e.key === "Home") controller.current.target = 0;
                if (e.key === "End") controller.current.target = lastSlot;
              }}
              className="relative h-8 w-[min(52vw,320px)] cursor-grab touch-none active:cursor-grabbing"
            >
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/30" />
              {visibleBooks.map(({ book: b }, i) => (
                <span
                  key={b.id}
                  className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-white/30"
                  style={{ left: `${(i / Math.max(1, lastSlot)) * 100}%` }}
                />
              ))}
              <span
                ref={thumbRef}
                className="absolute top-1/2 h-4 w-7 -translate-1/2 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
                style={{
                  left: `${(INITIAL_SLOT / Math.max(1, lastSlot)) * 100}%`,
                }}
              />
            </div>
            <button
              type="button"
              aria-label="Next book"
              onClick={() => step(1)}
              className={`grid size-10 place-items-center rounded-[11px] ${glass}`}
            >
              <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
                <path
                  d="M6 3l5 5-5 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={close}
          tabIndex={isOpen ? 0 : -1}
          aria-hidden={!isOpen}
          className={`absolute top-24 right-4 z-20 flex h-[44px] items-center gap-2 rounded-[13px] pr-3 pl-4 text-sm duration-500 md:top-auto md:right-auto md:bottom-8 md:left-1/2 md:-translate-x-1/2 ${glass} ${
            isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          Close
          <kbd className="hidden rounded-md border border-current/30 px-1.5 py-0.5 font-sans text-[10px] tracking-wider opacity-70 sm:inline">
            ESC
          </kbd>
          <svg viewBox="0 0 16 16" className="size-4 sm:hidden" aria-hidden>
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button>

        <ShelfOverview open={overview} onPick={pickFromOverview} />

        <button
          type="button"
          onClick={toggleOverview}
          tabIndex={isOpen ? -1 : 0}
          aria-label={overview ? "Back to the bookshelf" : "View all shelves"}
          aria-pressed={overview}
          className={`library-fade absolute right-4 z-50 flex h-[51px] items-center justify-center rounded-[13px] bg-white/20 px-2 backdrop-blur-[20px] transition-[background-color,opacity] duration-500 hover:bg-white/30 sm:top-auto sm:right-8 sm:bottom-[51px] ${
            isOpen ? "pointer-events-none opacity-0" : ""
          } ${overview ? "top-5" : "top-24"}`}
        >
          <Image
            src="/images/library/arrows-out-cardinal.svg"
            alt=""
            width={32}
            height={32}
          />
        </button>

        <ul className="sr-only">
          {visibleBooks.map(({ book: b, index }) => (
            <li key={b.id}>
              <button type="button" onClick={() => open(index)}>
                Open {b.title} by {b.author}
              </button>
            </li>
          ))}
        </ul>

        <aside
          role="dialog"
          aria-modal="false"
          aria-labelledby="library-book-title"
          aria-hidden={!panelVisible}
          data-visible={panelVisible}
          className={`library-panel absolute inset-x-3 bottom-3 z-20 max-h-[46%] overflow-y-auto rounded-2xl border border-white/10 bg-(--lib-glass-strong) p-5 backdrop-blur-xl transition-opacity duration-300 sm:inset-x-6 sm:bottom-6 sm:p-6 md:inset-x-auto md:top-1/2 md:right-[4%] md:bottom-auto md:max-h-[80%] md:w-[min(520px,42%)] md:-translate-y-1/2 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none xl:right-[6%] ${
            panelVisible ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {book && (
            <>
              <p
                className="library-cascade text-sm text-white/60 sm:text-base"
                style={{ "--i": 0 } as CSSProperties}
              >
                by {book.author}
              </p>
              <h2
                id="library-book-title"
                className="library-cascade mt-3 font-[Georgia,'Times_New_Roman',serif] text-[34px] leading-[1.08] tracking-[-0.02em] text-white sm:text-[44px] xl:text-[56px]"
                style={{ "--i": 1 } as CSSProperties}
              >
                {book.title}
              </h2>
              <p
                className="library-cascade mt-4 line-clamp-4 text-[15px] leading-[1.45] text-white/60 sm:text-base"
                style={{ "--i": 2 } as CSSProperties}
              >
                {book.synopsis}
              </p>
              <div
                className="library-cascade mt-6 flex flex-wrap items-center gap-4 sm:gap-5"
                style={{ "--i": 3 } as CSSProperties}
              >
                <p
                  className="flex gap-0.5 text-accent"
                  aria-label={`Rated ${book.rating ?? 5} out of 5`}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      viewBox="0 0 20 20"
                      className={`size-5 ${i < (book.rating ?? 5) ? "" : "opacity-25"}`}
                      aria-hidden
                    >
                      <path
                        fill="currentColor"
                        d="M10 1.5l2.6 5.5 6 .8-4.4 4.1 1.1 5.9L10 15l-5.3 2.8 1.1-5.9L1.4 7.8l6-.8z"
                      />
                    </svg>
                  ))}
                </p>
                <span className="rounded-full bg-white/20 px-4 py-1.5 text-[13px] text-white backdrop-blur-[20px] sm:text-sm">
                  {book.verdict ?? "Highly Recommend"}
                </span>
              </div>
              <a
                href={buyLink(book)}
                target="_blank"
                rel="noreferrer"
                className="library-cascade mt-7 inline-flex h-[52px] items-center gap-2 rounded-[13px] bg-white px-6 text-base text-black transition-transform duration-300 hover:-translate-y-0.5 sm:mt-8"
                style={{ "--i": 4 } as CSSProperties}
              >
                Read the Book
                <span aria-hidden>→</span>
              </a>
            </>
          )}
        </aside>
      </section>
      {book && <BookDetails key={book.id} book={book} />}
    </>
  );
}
