import Image from "next/image";
import type { CSSProperties } from "react";

export type Crop = {
  left: string;
  top: string;
  width: string;
  height: string;
};

type CroppedImageProps = {
  src: string;
  alt?: string;
  intrinsicWidth: number;
  intrinsicHeight: number;
  /** Position of the visible window, relative to its positioned parent. */
  box?: Crop;
  /** Position and size of the image inside the window. */
  crop: Crop;
  className?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
};

export function CroppedImage({
  src,
  alt = "",
  intrinsicWidth,
  intrinsicHeight,
  box,
  crop,
  className = "",
  sizes,
  loading,
}: CroppedImageProps) {
  const boxStyle: CSSProperties | undefined = box && { ...box };

  return (
    <div
      className={`pointer-events-none overflow-hidden ${box ? "absolute" : ""} ${className}`}
      style={boxStyle}
    >
      <Image
        src={src}
        alt={alt}
        width={intrinsicWidth}
        height={intrinsicHeight}
        sizes={sizes}
        loading={loading}
        className="absolute max-w-none"
        style={{ ...crop }}
      />
    </div>
  );
}
