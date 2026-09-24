import Image from "next/image";
import { Fragment } from "react";

const stats = [
  { value: "$500M+", label: "Funding Raised" },
  { value: "20M+", label: "Users Across Platforms" },
  { value: "06", label: "Ventures Built" },
  { value: "15+", label: "Countries Operated In" },
  { value: "08", label: "Global Awards" },
];

export function Stats() {
  return (
    <section className="page-container bg-black py-[35px]">
      <dl className="flex flex-wrap justify-center gap-y-10 xl:flex-nowrap xl:items-center">
        {stats.map((stat, i) => (
          <Fragment key={stat.label}>
            {i > 0 && (
              <div
                aria-hidden
                className="hidden flex-1 items-center justify-center self-stretch xl:flex"
              >
                <Image
                  src="/images/divider-line.svg"
                  alt=""
                  width={81}
                  height={1}
                  className="h-px w-[81px] max-w-none rotate-90"
                />
              </div>
            )}
            <div className="flex flex-col-reverse items-center justify-center gap-[8px] basis-1/2 px-2 text-center leading-[1.119] sm:basis-1/3 lg:basis-1/5 xl:w-[176px] xl:shrink-0 xl:basis-auto xl:px-0 xl:last:w-[152px]">
              <dt className="text-[15px] text-white/60 sm:text-[16px] xl:text-[18px] xl:whitespace-nowrap">
                {stat.label}
              </dt>
              <dd className="text-[38px] text-white sm:text-[42px] xl:text-[47px]">
                {stat.value}
              </dd>
            </div>
          </Fragment>
        ))}
      </dl>
    </section>
  );
}
