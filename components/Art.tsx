/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";

/**
 * Renders a sliced illustration from /public/assets/art (the engraving set
 * sliced from the catalog sheets). These are fixed-palette engravings — they
 * do NOT theme via currentColor. Decorative by default (aria-hidden); pass a
 * `title`/alt for meaningful images.
 */
export type ArtName =
  // botanical / accents
  | "lemon-branch"
  | "italy-seal"
  // dividers
  | "div-heart"
  | "div-gold-heart"
  | "div-olive-heart"
  | "div-arrow-heart"
  | "div-arrow"
  | "div-branch"
  | "div-vine"
  | "div-laurel"
  | "div-laurel-spray"
  | "div-simple-leaf"
  // line icons
  | "pin" | "clock" | "info" | "shield" | "passport" | "heart"
  | "calendar" | "calendar-check" | "check" | "bookmark" | "cutlery"
  | "cocktail" | "chef-hat" | "mic" | "phone" | "envelope"
  // spot engravings
  | "bicycle" | "wine-glass" | "amphora" | "rolling-pin" | "ravioli" | "wine-bottle"
  | "lounge" | "sun" | "villa" | "ruins" | "shopping-bag" | "camera"
  | "gift" | "bed" | "suitcase" | "airplane" | "train" | "car"
  | "pot" | "pan" | "plant"
  // frames
  | "frame-scallop-terra" | "frame-scallop-blue" | "stamp-frame";

type ArtProps = {
  name: ArtName;
  /** px width; height stays proportional. Omit to let CSS control size. */
  width?: number;
  className?: string;
  alt?: string;
  style?: CSSProperties;
};

export default function Art({ name, width, className, alt = "", style }: ArtProps) {
  return (
    <img
      src={`/assets/art/${name}.svg`}
      width={width}
      className={className}
      alt={alt}
      aria-hidden={alt === "" ? true : undefined}
      style={style}
      loading="lazy"
    />
  );
}
