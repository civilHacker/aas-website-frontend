"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/markdown";

/** A sticky right-rail table of contents that highlights whichever heading is in view. */
export function TableOfContents({ toc }: { toc: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(toc[0]?.id ?? null);

  useEffect(() => {
    if (toc.length === 0) return;
    const headings = toc
      .map((entry) => document.getElementById(entry.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -70% 0px" },
    );
    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-28 hidden max-h-[70vh] w-[220px] shrink-0 flex-col gap-2 overflow-y-auto border-l border-white/10 pl-5 xl:flex"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-white/40">On this page</p>
      {toc.map((entry) => (
        <a
          key={entry.id}
          href={`#${entry.id}`}
          className={`text-sm leading-5 transition-colors ${
            entry.depth === 3 ? "pl-3" : ""
          } ${activeId === entry.id ? "text-white" : "text-white/50 hover:text-white/80"}`}
        >
          {entry.text}
        </a>
      ))}
    </nav>
  );
}
