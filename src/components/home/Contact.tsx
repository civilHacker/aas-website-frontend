"use client";

import Image from "next/image";
import { useActionState } from "react";
import { submitContact } from "@/app/actions/contact";
import {
  inquiryTypes,
  type ContactField,
  type ContactState,
} from "@/lib/contact";
import { SectionTag } from "@/components/ui/SectionTag";

const fieldClass =
  "h-[43px] w-full rounded-[14px] border-[0.5px] border-[#626262] bg-white/7 pr-[5px] pl-[11px] text-[16px] leading-[1.3] text-field placeholder:text-field outline-none transition-colors focus:border-white/60 aria-invalid:border-[#ff8a80]";

const labelClass = "text-[16px] leading-[1.3] text-field";

const initialState: ContactState = { status: "idle" };

export function Contact() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState,
  );

  const fieldProps = (name: ContactField) => ({
    name,
    defaultValue: state.values?.[name],
    "aria-invalid": state.errors?.[name] ? true : undefined,
    "aria-describedby": state.errors?.[name] ? `${name}-error` : undefined,
  });

  const fieldError = (name: ContactField) =>
    state.errors?.[name] && (
      <span id={`${name}-error`} className="text-[13px] text-[#ff8a80]">
        {state.errors[name]}
      </span>
    );

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
        action={formAction}
        noValidate
        className="flex w-full flex-col gap-[10px] lg:max-w-[640px]"
      >
        <div className="flex flex-col gap-[10px] sm:flex-row">
          <label className="flex flex-1 flex-col gap-[7px]">
            <span className={labelClass}>First Name</span>
            <input
              {...fieldProps("firstName")}
              autoComplete="given-name"
              placeholder="Ahmed"
              required
              maxLength={100}
              className={fieldClass}
            />
            {fieldError("firstName")}
          </label>
          <label className="flex flex-1 flex-col gap-[7px]">
            <span className={labelClass}>Last Name</span>
            <input
              {...fieldProps("lastName")}
              autoComplete="family-name"
              placeholder="AL Rashidhi"
              required
              maxLength={100}
              className={fieldClass}
            />
            {fieldError("lastName")}
          </label>
        </div>

        <label className="flex flex-col gap-[7px]">
          <span className={labelClass}>Email</span>
          <input
            {...fieldProps("email")}
            type="email"
            autoComplete="email"
            placeholder="Your@email.com"
            required
            maxLength={254}
            className={fieldClass}
          />
          {fieldError("email")}
        </label>

        <div className="flex flex-col gap-[10px] sm:flex-row">
          <label className="flex flex-1 flex-col gap-[7px]">
            <span className={labelClass}>Organisation</span>
            <input
              {...fieldProps("organisation")}
              autoComplete="organization"
              placeholder="You Company"
              maxLength={200}
              className={fieldClass}
            />
            {fieldError("organisation")}
          </label>
          <label className="flex flex-1 flex-col gap-[7px]">
            <span className={labelClass}>Inquiry Type</span>
            <span className="relative">
              <select
                {...fieldProps("inquiryType")}
                defaultValue={state.values?.inquiryType ?? inquiryTypes[0]}
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
            {fieldError("inquiryType")}
          </label>
        </div>

        <label className="flex flex-col gap-[7px]">
          <span className={labelClass}>Message</span>
          <textarea
            {...fieldProps("message")}
            placeholder="Tell me about yourself and what you working on...."
            required
            maxLength={5000}
            className={`${fieldClass} h-[116px] resize-none pt-[13px] pb-[17px]`}
          />
          {fieldError("message")}
        </label>

        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        <button
          type="submit"
          disabled={pending}
          className="flex h-[37px] w-full items-center justify-center rounded-[10px] bg-accent px-[18px] font-manrope text-[14px] leading-[1.3] font-semibold text-black transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send Message"}
        </button>

        <p
          role="status"
          aria-live="polite"
          className={`min-h-[20px] text-[14px] ${state.status === "error" ? "text-[#ff8a80]" : "text-accent"}`}
        >
          {state.message}
        </p>
      </form>
    </section>
  );
}
