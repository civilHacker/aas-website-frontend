"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { CroppedImage, type Crop } from "@/components/ui/CroppedImage";

type LogoLayer = {
  src: string;
  width: number;
  height: number;
  box: Crop;
  crop: Crop;
};

type Venture = {
  name: string;
  role: string;
  year: string;
  description: string;
  background: string;
  logo: LogoLayer[];
  tags: { value: string; label: string }[];
};

const astraLogo: LogoLayer[] = [
  {
    src: "/images/venture-astra-logo.png",
    width: 2172,
    height: 724,
    box: { left: "17.71%", top: "42.63%", width: "64.32%", height: "18.33%" },
    crop: { left: "0", top: "-86.23%", width: "146.46%", height: "263.77%" },
  },
  {
    src: "/images/venture-astra-logo.png",
    width: 2172,
    height: 724,
    box: { left: "66.15%", top: "60.96%", width: "15.89%", height: "5.98%" },
    crop: {
      left: "-222.17%",
      top: "-227.97%",
      width: "321.74%",
      height: "474.78%",
    },
  },
];

const barqLogo: LogoLayer[] = [
  {
    src: "/images/venture-barq-logo.png",
    width: 842,
    height: 595,
    box: { left: "17.71%", top: "36.65%", width: "64.32%", height: "24.3%" },
    crop: { left: "0", top: "-80.77%", width: "100%", height: "286.14%" },
  },
];

const rizekLogo: LogoLayer[] = [
  {
    src: "/images/venture-rizek-logo.png",
    width: 200,
    height: 200,
    box: { left: "28.91%", top: "36.65%", width: "42.19%", height: "26.69%" },
    crop: { left: "0", top: "0", width: "100%", height: "100%" },
  },
];

const astra: Venture = {
  name: "Astra Tech",
  role: "Founder & CEO",
  year: "2022",
  description:
    "Technology investment and development group building the infrastructure for the next generation of digital services across the Middle East. Acquired multiple platforms to create an integrated super-ecosystem.",
  background: "/images/venture-astra-bg.jpg",
  logo: astraLogo,
  tags: [
    { value: "$500M", label: "Raised" },
    { value: "Group 42", label: "Lead Investor" },
  ],
};

const barq: Venture = {
  name: "Barq EV",
  role: "Founder & CEO",
  year: "2021",
  description:
    "Emirati electric vehicle manufacturer designing and producing EVs purpose-built for the region's climate, infrastructure, and last-mile delivery needs. Pioneering sustainable transportation in the Gulf.",
  background: "/images/venture-barq-bg.jpg",
  logo: barqLogo,
  tags: [
    { value: "UAE", label: "EV Manufacturer" },
    { value: "Last-Mile", label: "Delivery" },
  ],
};

const rizek: Venture = {
  name: "Rizek",
  role: "Co-Founder",
  year: "2019",
  description:
    "Digital marketplace for household cleaning, maintenance, and healthcare services including COVID-19 testing and vaccinations. Raised $10M+ and became Abu Dhabi's leading home services platform before being acquired",
  background: "/images/venture-rizek-bg.jpg",
  logo: rizekLogo,
  tags: [
    { value: "$13.5M+", label: "Raised" },
    { value: "Abu Dhabi's #1", label: "Services" },
  ],
};

const ventures: Venture[] = [astra, barq, rizek, astra, barq, rizek];

const TRACK_WIDTH = 298;
const THUMB_WIDTH = 143;

export function Ventures() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  function handleScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }

  return (
    <section
      id="work"
      className="flex scroll-mt-6 flex-col gap-[45px] overflow-hidden bg-black py-[70px]"
    >
      <div className="page-container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[52px] leading-[0.95] whitespace-nowrap text-white sm:text-[71px]">
          I&apos;ve Built
        </h2>
        <p className="max-w-[411px] text-[18px] text-white/60 sm:text-right sm:text-[20px]">
          A curated portfolio of ventures — each solving a real problem, each
          built with conviction.
        </p>
      </div>

      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="scrollbar-none flex snap-x snap-mandatory gap-[12px] overflow-x-auto scroll-px-5 px-5 sm:scroll-px-8 sm:px-8 xl:scroll-px-[max(3.5rem,calc((100%-1568px)/2))] xl:px-[max(3.5rem,calc((100%-1568px)/2))]"
      >
        {ventures.map((venture, i) => (
          <VentureCard key={`${venture.name}-${i}`} venture={venture} />
        ))}
      </div>

      <div className="flex justify-center">
        <div
          role="progressbar"
          aria-label="Portfolio scroll position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          className="relative h-[4px] overflow-hidden rounded-[34px] bg-white/32"
          style={{ width: TRACK_WIDTH }}
        >
          <div
            className="absolute top-0 h-[4px] rounded-[37px] bg-accent transition-[left] duration-150"
            style={{
              width: THUMB_WIDTH,
              left: progress * (TRACK_WIDTH - THUMB_WIDTH),
            }}
          />
        </div>
      </div>
    </section>
  );
}

function VentureCard({ venture }: { venture: Venture }) {
  return (
    <article className="flex w-[min(384px,calc(100vw-56px))] shrink-0 snap-start flex-col gap-[27px] overflow-hidden rounded-[27px] bg-white/10 pb-[27px] backdrop-blur-[20px]">
      <div className="relative aspect-[384/251] w-full overflow-hidden rounded-[24px]">
        <Image
          src="/images/venture-card-base.jpg"
          alt=""
          fill
          sizes="384px"
          className="object-cover"
        />
        <Image
          src={venture.background}
          alt=""
          fill
          sizes="384px"
          className="object-cover"
        />
        {venture.logo.map((layer, i) => (
          <CroppedImage
            key={i}
            src={layer.src}
            alt={i === 0 ? venture.name : ""}
            intrinsicWidth={layer.width}
            intrinsicHeight={layer.height}
            box={layer.box}
            crop={layer.crop}
            sizes="400px"
          />
        ))}
      </div>

      <div className="flex flex-col gap-[13px] px-[18px]">
        <div className="flex items-start justify-between font-manrope text-[16px] leading-[1.119] whitespace-nowrap uppercase">
          <p className="text-white">{venture.role}</p>
          <p className="text-white/35">{venture.year}</p>
        </div>
        <p className="text-[16px] leading-[1.28] text-white/60">
          {venture.description}
        </p>
        <div className="flex flex-wrap gap-[8px] text-[15px] leading-[1.119] whitespace-nowrap">
          {venture.tags.map((tag) => (
            <span
              key={tag.value}
              className="flex items-center justify-center gap-[8px] rounded-[40px] bg-accent px-[11px] py-[7px]"
            >
              <span className="font-manrope font-semibold text-black">
                {tag.value}
              </span>
              <span className="text-black/60">{tag.label}</span>
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
