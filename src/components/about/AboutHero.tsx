import Image from "next/image";
import { CroppedImage } from "@/components/ui/CroppedImage";

const tealGradient = "bg-linear-to-b from-[#357172] to-[#343434]";

function Noise() {
  return (
    <Image
      src="/images/noise-texture.png"
      alt=""
      fill
      sizes="460px"
      className="pointer-events-none object-cover opacity-8"
    />
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-12 rounded-[29px] bg-[#357172] px-[30px] py-[17px] leading-[1.119] text-white lg:gap-[79px]">
      <p className="text-[44px] sm:text-[50px]">{value}</p>
      <p className="max-w-[253px] text-[16px]">{label}</p>
    </div>
  );
}

export function AboutHero() {
  return (
    <section
      aria-labelledby="about-heading"
      className="mx-auto flex max-w-[1648px] flex-col items-center gap-8 px-4 pt-10 sm:pt-14 xl:pt-[10px]"
    >
      <div className="flex flex-col items-center gap-[10px] text-center">
        <h1
          id="about-heading"
          className="text-[56px] leading-[1.119] text-white sm:text-[70px] lg:text-[82px]"
        >
          About
        </h1>
        <p className="max-w-[640px] text-[17px] leading-[1.12] text-white/60 sm:text-[20px]">
          Born in Jordan. Raised in England &amp; China. Educated in Canada
          &amp; London. Built companies across the UAE &amp; Middle East.
        </p>
      </div>

      <div className="grid w-full max-w-[1210px] grid-cols-1 gap-[11px] sm:grid-cols-2 lg:flex lg:items-stretch">
        <div
          className={`relative h-[520px] overflow-hidden rounded-[29px] sm:col-span-2 sm:h-[600px] lg:order-2 lg:h-auto lg:min-h-[624px] lg:w-[37.7%] lg:shrink-0 ${tealGradient}`}
        >
          <Noise />
          <CroppedImage
            src="/images/newsletter-portrait.png"
            alt="Abdallah Abu-Sheikh"
            intrinsicWidth={2000}
            intrinsicHeight={1333}
            sizes="(min-width: 1024px) 470px, 90vw"
            loading="eager"
            className="absolute -bottom-4 left-1/2 aspect-[464/589] h-[94%] -translate-x-1/2"
            crop={{
              left: "-38.47%",
              top: "0",
              width: "190.14%",
              height: "100%",
            }}
          />
          <p className="absolute top-[27px] left-[19px] text-[44px] leading-[0.96] text-white sm:text-[50px]">
            Founder
            <br />
            Builder
            <br />
            Investor
          </p>
        </div>

        <div className="flex flex-col gap-2 lg:order-1 lg:w-[30.25%] lg:shrink-0">
          <div
            className={`relative aspect-[366/412] overflow-hidden rounded-[29px] ${tealGradient}`}
          >
            <Noise />
            <Image
              src="/images/about/magazine-cover.png"
              alt="Abdallah Abu-Sheikh on the cover of CEO Middle East, September 2023"
              fill
              sizes="(min-width: 1024px) 370px, (min-width: 640px) 50vw, 100vw"
              className="object-cover object-top"
            />
          </div>
          <StatCard
            value="$500M+"
            label="Funding raised across ventures — led by Group 42."
          />
        </div>

        <div className="flex flex-col gap-2 lg:order-3 lg:w-[30.25%] lg:shrink-0">
          <StatCard
            value="20M+"
            label="Users reached across platforms built or acquired."
          />
          <div
            className={`relative aspect-[366/412] overflow-hidden rounded-[29px] lg:aspect-auto lg:min-h-[300px] lg:flex-1 ${tealGradient}`}
          >
            <Image
              src="/images/about/portrait-kandura.png"
              alt="Abdallah Abu-Sheikh in traditional Emirati dress"
              fill
              sizes="(min-width: 1024px) 370px, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
