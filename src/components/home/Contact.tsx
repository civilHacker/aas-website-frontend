"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { SectionTag } from "@/components/ui/SectionTag";

const inquiryTypes = [
  "Investment Inquiry",
  "Partnership",
  "Media & Press",
  "Speaking",
  "Mentorship",
  "Other",
];

const fieldClass =
  "h-[43px] w-full rounded-[14px] border-[0.5px] border-[#626262] bg-white/7 pr-[5px] pl-[11px] text-[16px] leading-[1.3] text-field placeholder:text-field outline-none transition-colors focus:border-white/60";

const labelClass = "text-[16px] leading-[1.3] text-field";

export function Contact() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section
      id="contact"
      className="page-container flex scroll-mt-6 flex-col gap-12 bg-black py-[42px] lg:min-h-[569px] lg:flex-row lg:items-center lg:justify-between lg:gap-16"
    >
      <div className="flex flex-col gap-[28px]">
        <SectionTag>Get in Touch</SectionTag>
        <div className="flex flex-col gap-6 lg:gap-[293px]">
          <h2 className="text-[52px] leading-[0.95] whitespace-nowrap text-white sm:text-[71px]">
            Let&apos;s Connect
          </h2>
          <p className="max-w-[433px] text-[18px] text-white/60 sm:text-[20px]">
            Whether you&apos;re a founder seeking guidance, a media team
            planning a feature, or a potential partner — I&apos;d love to hear
            from you.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-[10px] lg:max-w-[640px]"
      >
        <div className="flex flex-col gap-[10px] sm:flex-row">
          <label className="flex flex-1 flex-col gap-[7px]">
            <span className={labelClass}>First Name</span>
            <input
              name="firstName"
              autoComplete="given-name"
              placeholder="Ahmed"
              className={fieldClass}
            />
          </label>
          <label className="flex flex-1 flex-col gap-[7px]">
            <span className={labelClass}>Last Name</span>
            <input
              name="lastName"
              autoComplete="family-name"
              placeholder="AL Rashidhi"
              className={fieldClass}
            />
          </label>
        </div>

        <label className="flex flex-col gap-[7px]">
          <span className={labelClass}>Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Your@email.com"
            required
            className={fieldClass}
          />
        </label>

        <div className="flex flex-col gap-[10px] sm:flex-row">
          <label className="flex flex-1 flex-col gap-[7px]">
            <span className={labelClass}>Organisation</span>
            <input
              name="organisation"
              autoComplete="organization"
              placeholder="You Company"
              className={fieldClass}
            />
          </label>
          <label className="flex flex-1 flex-col gap-[7px]">
            <span className={labelClass}>Inquiry Type</span>
            <span className="relative">
              <select
                name="inquiryType"
                defaultValue={inquiryTypes[0]}
                className={`${fieldClass} appearance-none pr-[34px]`}
              >
                {inquiryTypes.map((type) => (
                  <option key={type} value={type} className="bg-black">
                    {type}
                  </option>
                ))}
              </select>
              <Image
                src="/images/caret-down.svg"
                alt=""
                width={24}
                height={24}
                className="pointer-events-none absolute top-1/2 right-[5px] -translate-y-1/2"
              />
            </span>
          </label>
        </div>

        <label className="flex flex-col gap-[7px]">
          <span className={labelClass}>Message</span>
          <textarea
            name="message"
            placeholder="Tell me about yourself and what you working on...."
            className={`${fieldClass} h-[116px] resize-none pt-[13px] pb-[17px]`}
          />
        </label>

        <button
          type="submit"
          className="flex h-[37px] w-full items-center justify-center rounded-[10px] bg-accent px-[18px] font-manrope text-[14px] leading-[1.3] font-semibold text-black transition-opacity hover:opacity-85"
        >
          Send Message
        </button>
      </form>
    </section>
  );
}
