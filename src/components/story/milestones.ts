import type { Crop } from "@/components/ui/CroppedImage";

export type Milestone = {
  tag: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  /** Slight tilt of the photo, in degrees. */
  tilt: number;
  /** Intrinsic size plus a crop window, for photos that need a custom framing. */
  crop?: { width: number; height: number; crop: Crop };
  trophy?: boolean;
  cta?: { label: string; href: string };
};

export const milestones: Milestone[] = [
  {
    tag: "EARLY LIFE",
    title: "Born in Jordan, Raised Globally",
    body: "Born in Jordan and spent formative years in England and China — a multicultural upbringing that shaped a global worldview from the very start.",
    image: "/images/story/01-jordan.png",
    alt: "Jordan",
    tilt: -1.69,
  },
  {
    tag: "BOARDING SCHOOL",
    title: "King's Academy, Jordan",
    body: "Attended one of Jordan's most prestigious boarding schools — an experience that instilled discipline, leadership, and the confidence to think independently.",
    image: "/images/story/02-kings-academy.png",
    alt: "King's Academy campus",
    tilt: 2.29,
  },
  {
    tag: "UNIVERSITY · CANADA",
    title: "Dual Degrees, Canadian Universities",
    body: "Earned a Bachelor's in Commerce from Saint Mary's University and a Bachelor's in Accounting & Finance from Dalhousie University — laying the business and financial foundation.",
    image: "/images/story/03-canada.png",
    alt: "University campus in Canada",
    tilt: -1.69,
  },
  {
    tag: "2016 · AGE 22",
    title: "First Venture: LUX Development Partners",
    body: "Co-founded a renewable energy development company — his first taste of building from nothing, learning the fundamentals of leadership and deal-making.",
    image: "/images/story/04-lux.png",
    alt: "Abdallah Abu-Sheikh",
    tilt: 2.29,
  },
  {
    tag: "2019",
    title: "Co-Founded Rizek — Abu Dhabi's Home Services Platform",
    body: "Co-founded Rizek, a digital marketplace providing household cleaning, maintenance, and healthcare services — including COVID-19 testing and vaccinations during the pandemic. The company became Abu Dhabi's leading home services app and raised over $13.5M in funding.",
    image: "/images/story/05-rizek.png",
    alt: "The Rizek founders",
    tilt: -1.69,
  },
  {
    tag: "2021",
    title: "MBA — London Business School",
    body: "Completed his MBA at London Business School while simultaneously building Barq EV. LBS sharpened his global strategy, gave him access to a world-class network, and reaffirmed one conviction: the Arab world's moment was arriving, and he would be at its centre.",
    image: "/images/story/06-lbs.png",
    alt: "London Business School",
    tilt: -1.73,
  },
  {
    tag: "2019",
    title: "Co-Founded Rizek — Abu Dhabi's Home Services Platform",
    body: "Co-founded Rizek, a digital marketplace providing household cleaning, maintenance, and healthcare services — including COVID-19 testing and vaccinations during the pandemic. The company became Abu Dhabi's leading home services app and raised over $13.5M in funding.",
    image: "/images/story/07-rizek-team.png",
    alt: "The Rizek team",
    tilt: -0.27,
  },
  {
    tag: "Mar 2022",
    title: "Founded Astra Tech",
    body: "In March 2022, Abdallah founded Astra Tech — a technology investment and development group with an audacious vision: build the Middle East's defining super-platform. Not just an app, but an integrated ecosystem where people live, pay, communicate, and work.",
    image: "/images/story/08-astra-tech.png",
    alt: "Astra Tech",
    tilt: -0.27,
  },
  {
    tag: "May 2022",
    title: "Cover of Entrepreneur Middle East",
    body: 'Featured on the cover of Entrepreneur Magazine Middle East — "Meet Abdallah of Arabia." A milestone moment of regional recognition that brought his story to hundreds of thousands of readers across the MENA region.',
    image: "/images/story/09-entrepreneur-cover.png",
    alt: "Abdallah Abu-Sheikh photographed above the Dubai skyline",
    tilt: -0.27,
  },
  {
    tag: "Dec 2022",
    title: "$500M Investment Round Led by Group 42",
    body: "Astra Tech secured a $500 million investment in a landmark funding round led by Group 42 (G42), Abu Dhabi's AI and cloud computing powerhouse. One of the largest ever fundraises for a MENA tech company — validating the super-platform thesis on a global stage.",
    image: "/images/story/10-g42.png",
    alt: "Astra Tech and G42",
    tilt: -0.27,
  },
  {
    tag: "Jan 2023",
    title: "Astra Tech Acquires Botim",
    body: "Acquired Botim, the Middle East's largest internet calling platform and super-app, serving 20M+ users across MENA. Botim became the centrepiece of the Astra Tech super-platform — the consumer-facing product that would anchor everything else.",
    image: "/images/story/11-botim.png",
    alt: "Botim",
    tilt: -0.27,
  },
  {
    tag: "Dec 2022",
    title: "Forbes 30 Under 30 & Global Awards",
    body: "Named to Forbes Middle East's 30 Under 30, won Young Achiever of the Year at Gulf Business Awards, Investor of the Year by Entrepreneur ME, Top 50 GCC CEOs, and Most Influential Arab by Arabian Business. Recognition came from every direction — but the building never stopped.",
    image: "/images/story/12-forbes.png",
    alt: "Forbes 30 Under 30",
    tilt: -0.27,
    trophy: true,
  },
  {
    tag: "Nov 2024",
    title: "Departing Astra Tech — What's Next",
    body: "In November 2024, Abdallah departed from Astra Tech after a defining two-year run that fundamentally changed the MENA tech landscape. Now focused on the next chapter: investing in the right founders, building new products from scratch, and sharing everything he's learned with the next generation of Arab entrepreneurs.",
    image: "/images/story/13-departing.png",
    alt: "Abdallah Abu-Sheikh",
    tilt: -1.84,
  },
  {
    tag: "Nov 2024",
    title: "The Story Continues…",
    body: "The next chapter is being written. Follow along through the blog, newsletter, and upcoming ventures. If you're building something ambitious in the Arab world — reach out.",
    image: "/images/story/14-continues.png",
    alt: "Abdallah Abu-Sheikh at his desk",
    tilt: -1.84,
    crop: {
      width: 679,
      height: 1024,
      crop: {
        left: "-0.71%",
        top: "-40.31%",
        width: "100%",
        height: "255.38%",
      },
    },
    cta: { label: "Get in touch", href: "/#contact" },
  },
];
