"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { key: "home", label: "Home", href: "/" },
  { key: "library", label: "Library", href: "/library" },
  { key: "work", label: "Work", href: "/work" },
  { key: "featured", label: "Featured", href: "/featured" },
  { key: "about", label: "About", href: "/about" },
  { key: "story", label: "Story", href: "/story" },
];

type NavKey = (typeof navLinks)[number]["key"];

export function SiteHeader({
  active = "home",
  onDark = false,
}: {
  active?: NavKey;
  /** Plain black backdrop: the dark glass used over the hero would vanish. */
  onDark?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const glass = onDark ? "bg-white/20" : "bg-black/20";

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const closeOnDesktop = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("keydown", close);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      window.removeEventListener("keydown", close);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, [menuOpen]);

  return (
    <header className="relative z-20 flex items-center justify-between gap-4 px-4 pt-6 sm:pt-8 xl:px-10 xl:pt-[38px]">
      <div className="flex min-w-0 flex-col gap-[6px]">
        <p className="font-manrope text-[19px] leading-[1.01] font-semibold tracking-[-0.575px] whitespace-nowrap text-white sm:text-[23px]">
          Abdallah Abu-Sheikh
        </p>
        <p className="text-[14px] leading-[1.119] text-white/49 sm:text-[15px]">
          Founder · Builder · Investor
        </p>
      </div>

      <nav
        aria-label="Primary"
        className={`absolute top-8 left-1/2 hidden h-[51px] -translate-x-1/2 items-center gap-[21px] rounded-[14px] pr-[31px] pl-[9px] backdrop-blur-[20px] lg:flex xl:top-[38px] ${glass}`}
      >
        {navLinks.map((link) =>
          link.key === active ? (
            <Link
              key={link.label}
              href={link.href}
              aria-current="page"
              className="flex h-[39px] items-center rounded-[11px] bg-white px-[13px] text-[15px] leading-[1.119] text-black"
            >
              {link.label}
            </Link>
          ) : (
            <Link
              key={link.label}
              href={link.href}
              className="text-[15px] leading-[1.119] text-white transition-opacity hover:opacity-70"
            >
              {link.label}
            </Link>
          ),
        )}
      </nav>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/#contact"
          className="hidden rounded-[20px] bg-white px-6 py-[17px] text-[15px] leading-[1.119] text-black transition-opacity hover:opacity-85 sm:block sm:px-[31px]"
        >
          Contact
        </Link>
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className={`flex size-[46px] items-center justify-center rounded-[14px] backdrop-blur-[20px] lg:hidden ${glass}`}
        >
          <span className="relative block h-[12px] w-[18px]">
            <span
              className={`absolute left-0 h-[2px] w-full rounded-full bg-white transition-transform duration-200 ${menuOpen ? "top-[5px] rotate-45" : "top-0"}`}
            />
            <span
              className={`absolute top-[5px] left-0 h-[2px] w-full rounded-full bg-white transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute left-0 h-[2px] w-full rounded-full bg-white transition-transform duration-200 ${menuOpen ? "top-[5px] -rotate-45" : "top-[10px]"}`}
            />
          </span>
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="absolute top-full right-4 left-4 mt-3 flex flex-col gap-1 rounded-[20px] bg-black/70 p-3 backdrop-blur-[20px] lg:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              aria-current={link.key === active ? "page" : undefined}
              className={`rounded-[12px] px-4 py-3 text-[16px] ${link.key === active ? "bg-white text-black" : "text-white hover:bg-white/10"}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-1 rounded-[12px] bg-accent px-4 py-3 text-center text-[16px] text-black sm:hidden"
          >
            Contact
          </Link>
        </nav>
      )}
    </header>
  );
}
