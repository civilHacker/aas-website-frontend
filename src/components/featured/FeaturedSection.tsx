"use client";

import Image from "next/image";
import { useState } from "react";
import {
  featuredFilters,
  kindLabels,
  type FeaturedItem,
  type FeaturedKind,
} from "./items";

/** Only public Supabase Storage images are allowed through the image optimizer (see next.config.ts). */
const optimizable = (src: string) =>
  src.startsWith(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`,
  );

function FeaturedCard({ item }: { item: FeaturedItem }) {
  return (
    <article className="group relative flex flex-col items-start gap-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-[30px] bg-linear-to-b from-[#357172] to-[#343434]">
        {item.image ? (
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            unoptimized={!optimizable(item.image)}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-[28px] text-white/70">
            {item.kind ? kindLabels[item.kind] : "Featured"}
          </span>
        )}
      </div>

      {item.kind && (
        <p className="flex items-center gap-2 px-[11px] py-[7px] text-[13px] leading-[1.35] text-white">
          <Image
            src="/images/featured/icon-notebook.svg"
            alt=""
            width={16}
            height={16}
          />
          {kindLabels[item.kind]}
        </p>
      )}

      <h2 className="max-w-[318px] font-manrope text-[18px] leading-[1.35] text-white sm:text-[20px]">
        {item.title}
      </h2>

      <p className="line-clamp-3 max-w-[380px] text-[15px] leading-[1.4] text-white/60">
        {item.description}
      </p>

      {item.href && (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Read more: ${item.title} (opens in a new tab)`}
          className="mt-1 rounded-[40px] bg-[#202020] px-[11px] py-[7px] text-[15px] leading-[1.119] text-white/86 transition-colors group-hover:bg-white group-hover:text-black after:absolute after:inset-0 after:rounded-[30px]"
        >
          Read More
        </a>
      )}
    </article>
  );
}

export function FeaturedSection({ items }: { items: FeaturedItem[] }) {
  const [filter, setFilter] = useState<FeaturedKind | "all">("all");
  const shown = items.filter(
    (item) => filter === "all" || item.kind === filter,
  );
  const activeLabel = featuredFilters.find((f) => f.id === filter)?.label;

  return (
    <section
      aria-labelledby="featured-heading"
      className="page-container flex flex-col gap-7 pt-14 pb-20 sm:gap-[33px] sm:pt-20 lg:pt-[92px] lg:pb-28"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <h1
          id="featured-heading"
          className="text-[46px] leading-[0.95] text-white sm:text-[58px] lg:text-[71px]"
        >
          Featured
        </h1>
        <p className="max-w-[316px] text-[17px] text-white/60 sm:text-right sm:text-[20px]">
          Ideas that have moved audiences across the region and beyond.
        </p>
      </div>

      <div
        role="group"
        aria-label="Filter featured work"
        className="-mx-5 flex max-w-[calc(100%+2.5rem)] overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:max-w-full sm:px-0"
      >
        <div className="flex h-[52px] shrink-0 items-center gap-1 rounded-[15px] bg-white/20 p-[5px] pr-2 backdrop-blur-[20px] sm:gap-2 sm:pr-3">
          {featuredFilters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`flex h-[42px] min-w-[52px] items-center justify-center rounded-[10px] px-2.5 sm:min-w-[62px] sm:px-3 text-[15px] leading-[1.119] whitespace-nowrap transition-colors duration-300 ${
                filter === f.id
                  ? "bg-white text-black"
                  : "text-white hover:bg-white/15"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {shown.length > 0 ? (
        <div className="grid gap-x-3 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((item) => (
            <FeaturedCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="rounded-[30px] bg-white/10 px-7 py-16 text-center text-white/60">
          {filter === "all"
            ? "Nothing featured yet — check back soon."
            : `No ${activeLabel?.toLowerCase()} to show yet.`}
        </p>
      )}
    </section>
  );
}
