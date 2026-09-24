"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "@/app/actions/subscribe";
import { CroppedImage } from "@/components/ui/CroppedImage";

const initialState: SubscribeState = { status: "idle" };

export function Newsletter() {
  const [state, formAction, pending] = useActionState(subscribe, initialState);

  return (
    <section className="bg-black px-4 pt-[79px]">
      <div className="relative mx-auto flex max-w-[1648px] flex-col rounded-[36px] lg:flex-row lg:items-end lg:justify-between xl:block xl:h-[402px]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[36px] bg-white/10"
        >
          <CroppedImage
            src="/images/noise-texture.png"
            intrinsicWidth={1233}
            intrinsicHeight={1275}
            sizes="1200px"
            className="absolute inset-0 opacity-8"
            crop={{
              left: "26.68%",
              top: "-97.86%",
              width: "100%",
              height: "300.44%",
            }}
          />
        </div>

        <div className="relative flex flex-col gap-[8px] px-5 pt-10 sm:px-8 sm:pt-12 lg:self-center lg:py-14 xl:absolute xl:top-[67px] xl:left-10 xl:p-0">
          <h2 className="max-w-[565px] text-[40px] leading-[1.119] text-white sm:text-[56px] lg:text-[64px] xl:h-[155px] xl:w-[565px]">
            Get My Best Thinking, Weekly
          </h2>
          <p className="max-w-[538px] text-[16px] leading-[1.46] text-white/60">
            Join thousands of founders and operators who read my newsletter on
            building companies, investing, and life in the Arab world.
          </p>
          <form
            action={formAction}
            className="mt-2 flex h-[51px] w-full max-w-[351px] items-center justify-between gap-2 rounded-[14px] bg-white/18 pr-[5px] pl-[11px] xl:mt-0"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="your@email.com"
              required
              maxLength={254}
              defaultValue={state.email}
              aria-describedby="newsletter-status"
              className="min-w-0 flex-1 bg-transparent text-[16px] leading-[1.3] text-field outline-none placeholder:text-field"
            />
            <button
              type="submit"
              disabled={pending}
              className="flex h-[37px] shrink-0 items-center justify-center rounded-[10px] bg-accent px-[18px] text-[14px] leading-[1.3] text-black transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-60"
            >
              {pending ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
          <p
            id="newsletter-status"
            role="status"
            aria-live="polite"
            className={`min-h-[20px] text-[14px] ${state.status === "error" ? "text-[#ff8a80]" : "text-accent"}`}
          >
            {state.message}
          </p>
        </div>

        <CroppedImage
          src="/images/newsletter-portrait.png"
          alt="Abdallah Abu-Sheikh"
          intrinsicWidth={2000}
          intrinsicHeight={1333}
          sizes="(min-width: 1280px) 800px, 500px"
          className="relative mx-auto mt-8 aspect-[415/525] w-[260px] sm:w-[320px] lg:mx-0 lg:-mt-20 lg:mr-8 lg:w-[340px] lg:shrink-0 xl:absolute xl:top-[-122.83px] xl:right-[6%] xl:mt-0 xl:h-[525px] xl:w-[415px]"
          crop={{ left: "-38.47%", top: "0", width: "190.14%", height: "100%" }}
        />
      </div>
    </section>
  );
}
