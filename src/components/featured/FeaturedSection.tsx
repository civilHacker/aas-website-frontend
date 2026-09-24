"use client";

import Image from "next/image";
import { useState } from "react";
import {
  featuredFilters,
  featuredItems,
  kindLabels,
  type FeaturedItem,
  type FeaturedKind,
} from "./items";

function FeaturedCard({ item }: { item: FeaturedItem }) {
  return (
    <article className="group relative flex flex-col items-start gap-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-[30px] bg-white">
        <Image
          src={item.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex items-center gap-2 text-[13px] leading-[1.35] text-white">
        <span className="flex items-center gap-2 px-[11px] py-[7px]">
          <Image
            src="/images/featured/icon-notebook.svg"
            alt=""
            width={16}
            height={16}
          />
          {kindLabels[item.kind]}
        </span>
        <span className="flex h-[25px] items-center border-l border-[#c3c3c3] px-[11px]">
          {item.duration}
        </span>
      </div>

      <h2 className="max-w-[318px] font-manrope text-[18px] leading-[1.35] text-white sm:text-[20px]">
        {item.title}
      </h2>

      <a
        href={item.href}
        aria-label={`Read more: ${item.title}`}
        className="rounded-[40px] bg-[#202020] px-[11px] py-[7px] text-[15px] leading-[1.119] text-white/86 transition-colors group-hover:bg-white group-hover:text-black after:absolute after:inset-0 after:rounded-[30px]"
      >
        Read More
      </a>
    </article>
  );
}

export function FeaturedSection() {
  const [filter, setFilter] = useState<FeaturedKind | "all">("all");
  const shown = featuredItems.filter(
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
          No {activeLabel?.toLowerCase()} to show yet.
        </p>
      )}
    </section>
  );
}
