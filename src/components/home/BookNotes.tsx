import Image from "next/image";
import Link from "next/link";
import { SectionTag } from "@/components/ui/SectionTag";

const books = [
  {
    title: "The Making of Prince",
    note: "“The book I come back to more than any other. Written for no one but himself, which is exactly why it still lands.”",
    rating: 5,
    verdict: "Highly Recommend",
  },
  {
    title: "Thinking, Fast and Slow",
    note: "“No sugar-coating. The chapter on demoting a friend is the most honest thing I’ve read on management.”",
    rating: 4,
    verdict: "Highly Recommend",
  },
  {
    title: "The Hard Thing About Hard Things",
    note: "“Changed how I read every pitch deck and every hiring decision since.”",
    rating: 5,
    verdict: "Must Read",
  },
];

export function BookNotes() {
  return (
    <section
      id="library"
      className="page-container flex scroll-mt-6 flex-col gap-[32px] bg-black pt-[42px] pb-20 sm:pb-28 lg:pb-36"
    >
      <div className="flex flex-col gap-[28px]">
        <SectionTag>Notes &amp; Commentary</SectionTag>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <h2 className="text-[52px] leading-[0.95] text-white sm:text-[71px] md:w-[459px]">
            Recent
            <br />
            Comments
          </h2>
          <div className="flex flex-col items-start gap-6 md:items-end">
            <p className="max-w-[423px] text-[18px] text-white/60 sm:text-[20px] md:text-right">
              A running log of what I&apos;m reading, and the notes, ratings,
              and recommendations I&apos;ve written on each.
            </p>
            <Link
              href="/library"
              className="flex h-[45px] w-[175px] items-center justify-center rounded-[15px] bg-accent px-[18px] font-manrope text-[14px] leading-[1.3] font-semibold text-black transition-opacity hover:opacity-85"
            >
              Explore Library →
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 sm:gap-[12px] lg:grid-cols-3">
        {books.map((book) => (
          <article key={book.title} className="flex flex-col gap-[16px]">
            <div className="relative aspect-square w-full overflow-hidden rounded-[30px] bg-white">
              <div className="absolute top-[6.82%] left-[17.05%] h-[86.61%] w-[65.88%]">
                <Image
                  src="/images/book-cover.png"
                  alt={`${book.title} cover`}
                  fill
                  sizes="(min-width: 1024px) 260px, 60vw"
                  className="object-cover"
                />
              </div>
            </div>
            <h3 className="font-manrope text-[20px] leading-[1.35] font-medium text-white">
              {book.title}
            </h3>
            <p className="font-manrope text-[16px] leading-[1.35] text-white">
              {book.note}
            </p>
            <div className="flex items-center gap-[16px]">
              <p
                className="text-[22px] leading-[1.119] whitespace-nowrap"
                aria-label={`Rated ${book.rating} out of 5`}
              >
                <span className="text-accent">{"★".repeat(book.rating)}</span>
                <span className="text-[#d5d5cb]">
                  {"★".repeat(5 - book.rating)}
                </span>
              </p>
              <span className="rounded-[29px] bg-white/19 px-[14px] py-[7px] text-[15px] leading-[1.119] whitespace-nowrap text-white">
                {book.verdict}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
