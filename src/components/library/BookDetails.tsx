"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { storeLinks, type LibraryBook } from "./books";

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
  const stores = storeLinks(book);

  return (
    <div className="bg-linear-to-b from-[#100604] to-black">
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
    </div>
  );
}
