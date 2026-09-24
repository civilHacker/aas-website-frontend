"use client";

import Image from "next/image";
import { useEffect, useRef, type PointerEvent } from "react";
import { SectionTag } from "@/components/ui/SectionTag";
import type { Award } from "@/lib/awards";

const TROPHY_W = 151;
const TROPHY_H = 170;

export function Awards({ awards }: { awards: Award[] }) {
  const listRef = useRef<HTMLDivElement>(null);
  const trophyRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, active: false });
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => () => cancelAnimationFrame(frame.current ?? 0), []);

  const tick = () => {
    const p = pos.current;
    const el = trophyRef.current;
    if (!el) return;
    const dx = p.tx - p.x;
    const dy = p.ty - p.y;
    p.x += dx * 0.16;
    p.y += dy * 0.16;
    const tilt = Math.max(-12, Math.min(12, dx * 0.12));
    el.style.transform = `translate3d(${p.x - TROPHY_W / 2}px, ${p.y - TROPHY_H / 2}px, 0) rotate(${tilt}deg)`;
    if (p.active || Math.abs(dx) + Math.abs(dy) > 0.5)
      frame.current = requestAnimationFrame(tick);
    else frame.current = undefined;
  };

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = listRef.current!.getBoundingClientRect();
    const p = pos.current;
    p.tx = event.clientX - rect.left;
    p.ty = event.clientY - rect.top;
    if (!p.active) {
      p.active = true;
      p.x = p.tx;
      p.y = p.ty;
      trophyRef.current?.setAttribute("data-visible", "true");
    }
    if (frame.current === undefined)
      frame.current = requestAnimationFrame(tick);
  };

  const onLeave = () => {
    pos.current.active = false;
    trophyRef.current?.setAttribute("data-visible", "false");
  };

  return (
    <section
      id="awards"
      aria-labelledby="awards-heading"
      className="page-container scroll-mt-8 pt-20 pb-12 sm:pt-24 lg:pt-[120px] lg:pb-[120px]"
    >
      <div className="flex flex-col gap-7">
        <SectionTag>Recognition</SectionTag>
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-10">
          <h2
            id="awards-heading"
            className="max-w-[459px] text-[46px] leading-[0.95] text-white sm:text-[58px] lg:text-[71px]"
          >
            Awards &amp;
            <br />
            Accolades
          </h2>
          <p className="max-w-[411px] text-[17px] text-white/60 sm:text-[20px] md:text-right">
            Recognised by the region&apos;s and world&apos;s most respected
            institutions for entrepreneurial impact and leadership.
          </p>
        </div>
      </div>

      <div
        ref={listRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative mt-14 sm:mt-20 lg:mt-[120px]"
      >
        <ol>
          {awards.map((award, i) => (
            <li
              key={award.id}
              className={`group flex items-center justify-between gap-6 py-[18px] ${
                i > 0 ? "border-t border-[#4f4b4b]/40" : "pt-0"
              }`}
            >
              <div className="flex min-w-0 flex-col gap-2 leading-[1.15] transition-transform duration-500 ease-out group-hover:translate-x-2">
                <h3 className="text-[19px] text-white sm:text-[24px]">
                  {award.title}
                </h3>
                <p className="font-manrope text-[15px] text-white/50 sm:text-[20px]">
                  {award.by}
                </p>
              </div>
              <p className="flex shrink-0 flex-col items-end gap-1 leading-[1.15] text-white">
                <span className="text-[17px] sm:text-[24px]">Award</span>
                <span className="text-[28px] sm:text-[38px]">{award.year}</span>
              </p>
            </li>
          ))}
        </ol>

        <div
          ref={trophyRef}
          aria-hidden
          data-visible="false"
          className="group/trophy pointer-events-none absolute top-0 left-0 z-10 hidden will-change-transform lg:block"
          style={{ width: TROPHY_W, height: TROPHY_H }}
        >
          <Image
            src="/images/about/award-trophy.png"
            alt=""
            width={TROPHY_W}
            height={TROPHY_H}
            className="size-full scale-75 rounded-[9px] object-contain opacity-0 transition-[opacity,scale] duration-300 ease-out group-data-[visible=true]/trophy:scale-100 group-data-[visible=true]/trophy:opacity-100"
          />
        </div>
      </div>
    </section>
  );
}
