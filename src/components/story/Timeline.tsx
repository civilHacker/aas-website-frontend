"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { CroppedImage } from "@/components/ui/CroppedImage";
import { milestones, type Milestone } from "./milestones";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - (1 - t) ** 3;

const DOT = "bg-[radial-gradient(circle,#999_0%,#c5c577_50%,#f1f155_100%)]";

function MilestoneCard({ item }: { item: Milestone }) {
  return (
    <>
      <div className="relative">
        <div
          className="relative aspect-[446/263] w-full overflow-hidden shadow-[0_18px_40px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-out group-hover:scale-[1.02] group-hover:rotate-0"
          style={{ rotate: `${item.tilt}deg` }}
        >
          {item.crop ? (
            <CroppedImage
              src={item.image}
              alt={item.alt}
              intrinsicWidth={item.crop.width}
              intrinsicHeight={item.crop.height}
              sizes="(min-width: 768px) 460px, 90vw"
              className="absolute inset-0"
              crop={item.crop.crop}
            />
          ) : (
            <Image
              src={item.image}
              alt={item.alt}
              fill
              sizes="(min-width: 768px) 460px, 90vw"
              className="object-cover"
            />
          )}
        </div>
        {item.trophy && (
          <Image
            src="/images/about/trophy.png"
            alt=""
            width={151}
            height={170}
            className="pointer-events-none absolute -top-6 -right-2 w-[90px] sm:-top-[37px] sm:w-[151px] lg:-right-[75px]"
          />
        )}
      </div>

      <div className="flex flex-col gap-[14px]">
        <p className="text-[14px] leading-[0.95] tracking-[0.45px] text-white uppercase sm:text-[15px]">
          {item.tag}
        </p>
        <h2 className="font-manrope text-[24px] leading-[1.1] tracking-[0.9px] text-white sm:text-[30px]">
          {item.title}
        </h2>
        <p className="text-[17px] leading-[1.06] text-white/60 sm:text-[20px]">
          {item.body}
        </p>
        {item.cta && (
          <Link
            href={item.cta.href}
            className="mt-1 flex h-[37px] w-[128px] items-center justify-center rounded-[10px] bg-accent text-[14px] leading-[1.3] text-black transition-opacity hover:opacity-85"
          >
            {item.cta.label}
          </Link>
        )}
      </div>
    </>
  );
}

export function Timeline() {
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, (window.innerHeight * 0.55 - rect.top) / rect.height),
      );
      const px = `${progress * rect.height}px`;
      if (fillRef.current) fillRef.current.style.height = px;
      if (dotRef.current) dotRef.current.style.top = px;

      if (reduced) return;
      const list = listRef.current;
      const origin = list?.offsetParent?.getBoundingClientRect().top;
      if (!list || origin === undefined) return;
      const vh = window.innerHeight;
      const edge = vh * 0.3;
      list.querySelectorAll("li").forEach((item) => {
        const top = origin + item.offsetTop;
        const bottom = top + item.offsetHeight;
        if (bottom < -vh || top > vh * 2) return;
        const enter = easeOut(clamp01((vh - top) / edge));
        const exit = easeOut(clamp01(bottom / edge));
        const seen = Math.min(enter, exit);
        const y = (1 - enter) * 80 - (1 - exit) * 60;
        item.style.opacity = `${seen}`;
        item.style.transform = `translate3d(0, ${y}px, 0) scale(${0.92 + 0.08 * seen})`;
      });
    };
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      aria-label="Timeline"
      className="mx-auto flex max-w-[1180px] flex-col px-5 pb-20 sm:px-8 lg:pb-28"
    >
      <p className="pl-10 font-manrope text-[26px] leading-[0.95] tracking-[0.9px] text-white sm:text-[30px] md:pl-0 md:text-center">
        1993
      </p>

      <div className="relative mt-5">
        <div
          ref={trackRef}
          aria-hidden
          className="absolute top-0 bottom-0 left-[14px] w-2 -translate-x-1/2 rounded-[46px] bg-[#333] shadow-[inset_0_4px_4px_rgba(123,112,112,0.25)] md:left-1/2"
        >
          <div
            ref={fillRef}
            className="absolute inset-x-0 top-0 rounded-[46px] bg-linear-to-b from-accent/10 to-accent/70"
          />
          <div
            ref={dotRef}
            className={`absolute top-0 left-1/2 size-7 -translate-1/2 rounded-full shadow-[0_0_24px_rgba(241,241,85,0.55)] sm:size-9 ${DOT}`}
          />
        </div>

        <ol
          ref={listRef}
          className="grid gap-y-12 pt-8 pl-10 md:grid-cols-2 md:gap-x-[128px] md:gap-y-0 md:pl-0"
        >
          {milestones.map((item, i) => (
            <li
              key={`${item.tag}-${item.title}-${i}`}
              style={{ "--row": i + 1 } as CSSProperties}
              className="group flex origin-center flex-col gap-[15px] will-change-[transform,opacity] md:pb-14 md:[grid-row:var(--row)/span_2] md:odd:col-start-1 md:even:col-start-2"
            >
              <MilestoneCard item={item} />
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-6 pl-10 font-manrope text-[26px] leading-[0.95] tracking-[0.9px] text-white sm:text-[30px] md:pl-0 md:text-center">
        Present
      </p>
    </section>
  );
}
