import type { Crop } from "@/components/ui/CroppedImage";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatar?: { src: string; width: number; height: number; crop: Crop };
};

// Only the first entry comes from the design; the rest are placeholders until real quotes arrive.
export const testimonials: Testimonial[] = [
  {
    quote:
      "Working with Abdallah means operating at a different speed. He sees around corners in a way that I haven't encountered in many founders.",
    name: "Institutional Investor",
    role: "Strategic Partner, Astra Tech",
    avatar: {
      src: "/images/work/testimonial-avatar.jpg",
      width: 240,
      height: 360,
      crop: { left: "-9.67%", top: "-39.5%", width: "119.35%", height: "179%" },
    },
  },
  {
    quote:
      "He builds with a clarity that is rare — every decision ties back to a real problem people face every day.",
    name: "Board Member",
    role: "Venture Partner, Barq EV",
  },
  {
    quote:
      "Abdallah asks the hard questions early, then moves faster than anyone in the room once the answer is clear.",
    name: "Co-Founder",
    role: "Operating Partner, Rizek",
  },
  {
    quote:
      "Few founders pair that level of ambition with such care for the team. People want to build alongside him.",
    name: "Early Employee",
    role: "Head of Product, Astra Tech",
  },
  {
    quote:
      "He has a gift for seeing what the region needs next and rallying the capital and talent to make it real.",
    name: "Limited Partner",
    role: "Regional Investment Fund",
  },
];
