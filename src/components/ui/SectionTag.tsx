import Image from "next/image";

export function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center self-start justify-center gap-[10px] rounded-[32px] border-[0.5px] border-white bg-white/12 px-[15px] py-[5px]">
      <Image
        src="/images/tag-icon.svg"
        alt=""
        width={20}
        height={20}
        className="mix-blend-screen"
      />
      <span className="font-manrope text-[15px] leading-[25.5px] tracking-[1.5px] text-white/70 uppercase">
        {children}
      </span>
    </div>
  );
}
