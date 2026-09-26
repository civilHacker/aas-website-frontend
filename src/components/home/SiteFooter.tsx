import Image from "next/image";
import Link from "next/link";

const socials = [
  { label: "Dribbble", icon: "/images/social-dribbble.svg", href: "#" },
  { label: "Behance", icon: "/images/social-behance.svg", href: "#" },
  { label: "LinkedIn", icon: "/images/social-linkedin.svg", href: "#" },
];

const columns = [
  {
    heading: "Work",
    links: [
      "Astra Tech",
      "Botim",
      "PayBy",
      "Barq EV",
      "Rizek",
      "All Ventures",
      "Investments",
    ].map((label) => ({ label, href: "/work" })),
  },
  {
    heading: "Featured",
    links: [
      "Articles",
      "Interviews",
      "Podcasts",
      "University Talks",
      "TEDx Talks",
      "Press",
    ].map((label) => ({ label, href: "/featured" })),
  },
  {
    heading: "More",
    links: [
      { label: "My Story", href: "/story" },
      { label: "Blog", href: "/overview#blog" },
      { label: "Book", href: "/overview#book" },
      { label: "Awards", href: "/about#awards" },
      { label: "Mentorship", href: "/overview#teaching" },
      { label: "Media & Contact", href: "/overview#contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-black px-4 py-[42px]">
      <div className="relative mx-auto max-w-[1648px] overflow-hidden rounded-[35px] bg-linear-to-b from-[#357172] to-[#343434] px-4 py-12 sm:px-8 lg:flex lg:min-h-[372px] lg:items-center lg:py-[54px] xl:px-10">
        <Image
          src="/images/noise-texture.png"
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none object-cover opacity-8"
        />

        <div className="relative flex w-full flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-col gap-[11px] lg:flex-1">
            <p className="max-w-[365px] text-[44px] leading-[0.95] text-white sm:text-[63px]">
              Abdallah Abu Sheikh
            </p>
            <div className="flex flex-col gap-[15px]">
              <p className="max-w-[448px] text-[18px] leading-[1.005] text-white/60 sm:text-[20px]">
                Builder. Founder. Investor. Based in the UAE. Focused on the
                Arab world and beyond.
              </p>
              <ul className="flex items-center gap-[22px]">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      aria-label={social.label}
                      className="block opacity-50 transition-opacity hover:opacity-100"
                    >
                      <Image src={social.icon} alt="" width={40} height={40} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:w-[478px] lg:shrink-0"
          >
            {columns.map((column) => (
              <div key={column.heading} className="flex flex-col gap-[8px]">
                <p className="text-[20px] text-white/94">{column.heading}</p>
                <ul className="text-[18px] leading-[27px] text-white/60">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
