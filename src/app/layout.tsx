import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Questrial } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif-next",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const questrial = Questrial({
  variable: "--font-questrial-next",
  weight: "400",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope-next",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abdallah Abu-Sheikh — Founder · Builder · Investor",
  description:
    "Building technology that changes how people live, connect, and move across the Middle East and beyond.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${questrial.variable} ${manrope.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
