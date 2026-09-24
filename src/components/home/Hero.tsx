import Image from "next/image";
import Link from "next/link";
import { CroppedImage } from "@/components/ui/CroppedImage";
import { SiteHeader } from "./SiteHeader";

export function Hero() {
  return (
    <section className="bg-black px-4 pt-[21px] pb-12 sm:pb-16 xl:pb-20">
      <div className="relative mx-auto max-w-[1648px] overflow-hidden rounded-[29px] bg-linear-to-b from-[#357172] to-[#343434] xl:h-[798px]">
        <Image
          src="/images/noise-texture.png"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          className="pointer-events-none object-cover opacity-8"
        />

        <SiteHeader />

        <div className="relative flex w-full flex-col md:grid md:grid-cols-[1fr_1.15fr] md:items-end md:gap-4 xl:absolute xl:inset-0 xl:block">
          <div className="relative z-10 flex flex-col gap-8 px-4 pt-12 md:self-center md:py-16 md:pr-0 xl:static xl:p-0">
            <div className="flex flex-col gap-[23px] xl:absolute xl:top-[249px] xl:left-10">
              <h1 className="max-w-[455px] text-[44px] leading-[1.119] text-white sm:text-[60px] lg:text-[71px]">
                Building What Matters.
              </h1>
              <div className="flex w-[243px] flex-col gap-[14px]">
                <p className="text-[15px] leading-[1.119] text-white">
                  Founder of
                </p>
                <div className="flex items-center gap-[18px]">
                  <div className="relative h-[32px] w-[65px] shrink-0">
                    <Image
                      src="/images/logo-founder-1.png"
                      alt="Founded company logo"
                      fill
                      sizes="65px"
                      className="object-fill object-bottom"
                    />
                  </div>
                  <div className="relative h-[16px] w-[160px] shrink-0">
                    <Image
                      src="/images/logo-astra-tech.png"
                      alt="Astra Tech"
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex max-w-[358px] flex-col gap-[16px] xl:absolute xl:top-[265px] xl:right-10 xl:w-[358px]">
              <p className="text-[15px] leading-[1.3] text-white/60 xl:min-h-[76px]">
                You may know me from Astra Tech or Forbes 30 Under 30 — but
                here&apos;s what truly drives me: building technology that
                changes how people live, connect, and move across the Middle
                East and beyond.
              </p>
              <div className="flex gap-[8px]">
                <Link
                  href="#work"
                  className="flex h-[37px] w-[142px] items-center justify-center rounded-[10px] bg-accent text-[14px] leading-[1.3] text-black transition-opacity hover:opacity-85"
                >
                  See My work →
                </Link>
                <Link
                  href="#story"
                  className="flex h-[37px] w-[128px] items-center justify-center rounded-[10px] bg-white/26 text-[14px] leading-[1.3] text-white backdrop-blur-[37px] transition-colors hover:bg-white/35"
                >
                  Read the story
                </Link>
              </div>
            </div>
          </div>

          <div className="relative z-0 mx-auto mt-10 -mb-[17px] aspect-[639/661] w-full max-w-[639px] md:mt-8 md:mr-4 overflow-hidden rounded-t-[110px] rounded-b-[16px] sm:rounded-t-[149px] xl:absolute xl:top-[154px] xl:left-1/2 xl:m-0 xl:h-[661px] xl:w-[639px] xl:-translate-x-1/2">
            <CroppedImage
              src="/images/hero-portrait.png"
              alt="Abdallah Abu-Sheikh"
              intrinsicWidth={1291}
              intrinsicHeight={1218}
              sizes="(min-width: 1280px) 700px, (min-width: 768px) 55vw, 110vw"
              loading="eager"
              className="absolute inset-0"
              crop={{
                left: "-4.2%",
                top: "0",
                width: "109.64%",
                height: "100%",
              }}
            />

            <div className="absolute bottom-[40px] left-1/2 flex xl:top-[546px] xl:bottom-auto -translate-x-1/2 flex-col items-center gap-[5px]">
              <p className="text-center text-[13px] leading-[1.119] whitespace-nowrap text-black lg:text-[15px]">
                You Might Have Seen on me
              </p>
              <div className="flex h-[42px] items-center gap-4 rounded-[47px] bg-black/20 px-5 backdrop-blur-[20px] lg:h-[49px] lg:gap-[27px] lg:px-[31px]">
                <CroppedImage
                  src="/images/forbes-logo.png"
                  alt="Forbes"
                  intrinsicWidth={1388}
                  intrinsicHeight={340}
                  sizes="135px"
                  className="relative h-[23px] w-[90px] shrink-0 lg:h-[33px] lg:w-[130px]"
                  crop={{
                    left: "-2.97%",
                    top: "0",
                    width: "103.63%",
                    height: "100%",
                  }}
                />
                <p className="text-center font-[Georgia,serif] text-[15px] leading-[1.119] whitespace-nowrap text-white lg:text-[20px]">
                  Most Influential Arab
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
