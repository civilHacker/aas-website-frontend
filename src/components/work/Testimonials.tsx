"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { CroppedImage } from "@/components/ui/CroppedImage";
import { SectionTag } from "@/components/ui/SectionTag";
import { testimonials, type Testimonial } from "./testimonialData";

/** Resting tilt for each slot in the pile, bottom card first. */
const ROTATIONS = [0, -6, 5, -4, 7, -5, 4];
/** Viewport heights of scrolling it takes for one card to land. */
const STEP = 0.7;
const SETTLE = "transform 520ms cubic-bezier(.2,.8,.2,1), filter 520ms";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - (1 - t) ** 3;

type Drag = {
  index: number;
  pointer: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  lastX: number;
  lastT: number;
  velocity: number;
};

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  /** order[slot] is the testimonial shown in that slot; slot 0 is the bottom of the pile. */
  const order = useRef(testimonials.map((_, i) => i));
  const drag = useRef<Drag | null>(null);
  const fly = useRef<{ index: number; x: number } | null>(null);
  const topSlot = useRef(0);
  const busy = useRef(false);
  const schedule = useRef<() => void>(() => {});
  const [active, setActive] = useState(0);
  const [canCycle, setCanCycle] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      const vh = window.innerHeight;
      const { top } = section.getBoundingClientRect();

      const progress = order.current.map((_, slot) => {
        if (reduced.matches) return 1;
        if (slot === 0) return clamp01((0.6 * vh - top) / (0.6 * vh));
        return clamp01(-top / (STEP * vh) - (slot - 1));
      });
      const eased = progress.map(easeOut);
      let highest = 0;
      progress.forEach((p, slot) => {
        if (p > 0.5) highest = slot;
      });

      order.current.forEach((index, slot) => {
        const el = cardRefs.current[index];
        if (!el) return;
        const e = eased[slot];
        const depth = Math.min(
          3,
          eased.slice(slot + 1).reduce((sum, v) => sum + v, 0),
        );
        const tilt = ROTATIONS[slot % ROTATIONS.length];
        let x = 0;
        let y = (1 - e) * vh * 0.85;
        let rotate = tilt * (1 + 1.5 * (1 - e));
        const d = drag.current;
        if (d?.index === index) {
          x = d.x;
          y += d.y;
          rotate += d.x * 0.06;
        }
        if (fly.current?.index === index) {
          x = fly.current.x;
          rotate += fly.current.x * 0.03;
        }
        el.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${1 - 0.04 * depth})`;
        el.style.filter = depth > 0.01 ? `brightness(${1 - 0.07 * depth})` : "";
        el.style.zIndex = `${slot + 1}`;
        el.style.visibility = progress[slot] > 0 ? "visible" : "hidden";
        el.toggleAttribute("inert", slot !== highest);
        el.setAttribute("aria-hidden", slot === highest ? "false" : "true");
      });

      topSlot.current = highest;
      setActive(order.current[highest]);
      setCanCycle(highest > 0);
    };

    schedule.current = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule.current, { passive: true });
    window.addEventListener("resize", schedule.current);
    reduced.addEventListener("change", schedule.current);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule.current);
      window.removeEventListener("resize", schedule.current);
      reduced.removeEventListener("change", schedule.current);
    };
  }, []);

  function settle(indices: number[]) {
    for (const index of indices) {
      const el = cardRefs.current[index];
      if (el) el.style.transition = SETTLE;
    }
    schedule.current();
    window.setTimeout(() => {
      for (const index of indices) {
        const el = cardRefs.current[index];
        if (el) el.style.transition = "";
      }
      busy.current = false;
    }, 540);
  }

  /** Throw the top card off to one side, then tuck it under the pile. */
  function sendToBack(direction: number) {
    const top = topSlot.current;
    if (busy.current || top === 0) return;
    busy.current = true;
    const index = order.current[top];
    const el = cardRefs.current[index];
    if (el) el.style.transition = "transform 360ms cubic-bezier(.5,0,.75,0)";
    fly.current = { index, x: direction * (window.innerWidth * 0.6 + 320) };
    schedule.current();
    window.setTimeout(() => {
      order.current.splice(top, 1);
      order.current.unshift(index);
      fly.current = null;
      settle(order.current.slice(0, top + 1));
    }, 360);
  }

  /** Pull the bottom card back out and drop it on top. */
  function bringToFront() {
    const top = topSlot.current;
    if (busy.current || top === 0) return;
    busy.current = true;
    const index = order.current[0];
    const el = cardRefs.current[index];
    order.current.shift();
    order.current.splice(top, 0, index);
    fly.current = { index, x: window.innerWidth * 0.6 + 320 };
    if (el) el.style.transition = "none";
    schedule.current();
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        fly.current = null;
        settle(order.current.slice(0, top + 1));
      }),
    );
  }

  function onPointerDown(event: PointerEvent<HTMLElement>, index: number) {
    if (busy.current || event.button !== 0) return;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {}
    event.currentTarget.style.transition = "none";
    drag.current = {
      index,
      pointer: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: 0,
      y: 0,
      lastX: event.clientX,
      lastT: event.timeStamp,
      velocity: 0,
    };
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const d = drag.current;
    if (!d || d.pointer !== event.pointerId) return;
    const dt = event.timeStamp - d.lastT;
    if (dt > 0) d.velocity = (event.clientX - d.lastX) / dt;
    d.lastX = event.clientX;
    d.lastT = event.timeStamp;
    d.x = event.clientX - d.startX;
    d.y = (event.clientY - d.startY) * 0.25;
    schedule.current();
  }

  function onPointerUp(event: PointerEvent<HTMLElement>) {
    const d = drag.current;
    if (!d || d.pointer !== event.pointerId) return;
    drag.current = null;
    const flicked = Math.abs(d.velocity) > 0.6 && Math.abs(d.x) > 30;
    if ((Math.abs(d.x) > 110 || flicked) && topSlot.current > 0) {
      sendToBack(Math.sign(d.x) || 1);
    } else {
      busy.current = true;
      settle([d.index]);
    }
  }

  const total = String(testimonials.length).padStart(2, "0");

  return (
    <section
      ref={sectionRef}
      aria-labelledby="testimonials-heading"
      style={{ "--steps": testimonials.length - 1 } as CSSProperties}
      className="relative h-[calc(130svh+var(--steps)*70svh)] bg-black motion-reduce:h-auto"
    >
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden pt-10 sm:pt-[42px] motion-reduce:static motion-reduce:h-auto">
        <div className="page-container flex w-full flex-col gap-[18px]">
          <SectionTag>Testimonials</SectionTag>
          <p className="max-w-[343px] text-[16px] leading-[1.119] text-white">
            A few highlights from the amazing people I&apos;ve had the chance to
            design for
          </p>
        </div>

        <div className="relative min-h-[380px] flex-1">
          {testimonials.map((testimonial, index) => (
            <figure
              key={testimonial.name}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              onPointerDown={(event) => onPointerDown(event, index)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="invisible absolute top-1/2 left-1/2 w-[min(469px,calc(100vw-48px))] cursor-grab touch-pan-y select-none active:cursor-grabbing"
            >
              <TestimonialCard testimonial={testimonial} />
            </figure>
          ))}
        </div>

        <div className="flex shrink-0 items-center justify-center gap-4 pt-2 pb-4">
          <button
            type="button"
            onClick={bringToFront}
            disabled={!canCycle}
            aria-label="Previous testimonial"
            className="flex size-10 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-[20px] transition-[background-color,opacity] hover:bg-white/20 disabled:opacity-30"
          >
            ←
          </button>
          <p
            aria-live="polite"
            className="min-w-[70px] text-center font-manrope text-[13px] tracking-[1.5px] text-white/60"
          >
            {String(active + 1).padStart(2, "0")} / {total}
          </p>
          <button
            type="button"
            onClick={() => sendToBack(-1)}
            disabled={!canCycle}
            aria-label="Next testimonial"
            className="flex size-10 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-[20px] transition-[background-color,opacity] hover:bg-white/20 disabled:opacity-30"
          >
            →
          </button>
        </div>

        <h2
          id="testimonials-heading"
          className="shrink-0 text-center text-[min(16vw,26svh)] leading-[0.95] whitespace-nowrap text-white"
        >
          Testimonials
        </h2>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { avatar } = testimonial;
  return (
    <div className="flex flex-col gap-[19px] rounded-[13px] bg-white py-[21px] pr-[19px] pl-[14px] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
      <Image
        src="/images/work/quote-mark.svg"
        alt=""
        width={20}
        height={20}
        draggable={false}
      />
      <blockquote className="font-manrope text-[18px] leading-[26px] text-[#0a0a0c] sm:text-[20px]">
        {testimonial.quote}
      </blockquote>
      <figcaption className="flex items-center gap-[8px] font-manrope">
        {avatar ? (
          <CroppedImage
            src={avatar.src}
            intrinsicWidth={avatar.width}
            intrinsicHeight={avatar.height}
            sizes="47px"
            className="relative size-[39px] shrink-0 rounded-full"
            crop={avatar.crop}
          />
        ) : (
          <span
            aria-hidden
            className="flex size-[39px] shrink-0 items-center justify-center rounded-full bg-[#357172] text-[14px] text-white"
          >
            {testimonial.name
              .split(" ")
              .map((word) => word[0])
              .join("")}
          </span>
        )}
        <span className="flex flex-col">
          <span className="text-[16px] leading-[20px] text-[#0a0a0c]">
            {testimonial.name}
          </span>
          <span className="text-[10px] leading-[16px] text-[#606163]">
            {testimonial.role}
          </span>
        </span>
      </figcaption>
    </div>
  );
}
