import { SiteHeader } from "./SiteHeader";

type NavKey = Parameters<typeof SiteHeader>[0]["active"];

/** The homepage header, framed with the hero's outer spacing so every page lines up. */
export function PageHeader({
  active,
  onDark = true,
  className = "",
}: {
  active: NavKey;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative z-30 px-4 pt-[21px] ${className}`}>
      <div className="relative mx-auto max-w-[1648px]">
        <SiteHeader active={active} onDark={onDark} />
      </div>
    </div>
  );
}
