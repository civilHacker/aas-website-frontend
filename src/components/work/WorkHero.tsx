import Image from "next/image";
import { SiteHeader } from "@/components/home/SiteHeader";
import { CroppedImage } from "@/components/ui/CroppedImage";

const portraitCrop = {
  left: "-38.47%",
  top: "0",
  width: "190.14%",
  height: "100%",
};

export function WorkHero() {
  return (
    <section className="bg-black px-4 pt-[21px]">
      <div className="@container relative mx-auto max-w-[1648px] overflow-hidden rounded-[29px] bg-linear-to-b from-[#357172] to-[#343434] lg:aspect-[1244/629]">
        <Image
          src="/images/noise-texture.png"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          className="pointer-events-none object-cover opacity-8"
        />

        <SiteHeader active="work" />

        <div className="relative flex flex-col pt-10 sm:pt-14 lg:static lg:p-0">
          <h1 className="px-4 text-[14.4cqw] leading-[1.119] whitespace-nowrap text-white lg:absolute lg:top-[30.8%] lg:left-[3.86%] lg:p-0">
            Changemaker
          </h1>

          <div className="relative z-10 flex max-w-[343px] flex-col gap-[7px] px-4 pt-4 leading-[1.119] lg:absolute lg:bottom-[6.2%] lg:left-[3.86%] lg:p-0">
            <p className="text-[20px] text-white sm:text-[22px]">
              Six Ventures, One Conviction
            </p>
            <p className="text-[16px] leading-[1.12] text-white/60">
              Renewable energy to fintech to super-apps — each company built to
              solve a specific, real problem across the region.
            </p>
          </div>

          <CroppedImage
            src="/images/newsletter-portrait.png"
            alt="Abdallah Abu-Sheikh"
            intrinsicWidth={2000}
            intrinsicHeight={1333}
            sizes="(min-width: 1024px) 34vw, 80vw"
            loading="eager"
            crop={portraitCrop}
            className="relative mx-auto mt-6 aspect-[426/540] w-[min(426px,78%)] lg:absolute lg:bottom-0 lg:left-[29.9%] lg:m-0 lg:w-[34.24%]"
          />
        </div>
      </div>
    </section>
  );
}
