import type { CuratedSpaceItem } from "@/lib/projects/curated-shared";
import type { ResolvedHomeSlide } from "@/lib/projects/home-shared";
import type { WorkItem } from "@/lib/projects/types";
import type { Asset } from "./LoadBar";

/**
 * Preloading warms a URL; next/image picks its URL from `sizes`. If the two disagree
 * the preload silently warms a candidate the page never requests — and the load bar
 * still reports success. So every `sizes` value lives here and is imported by BOTH the
 * <Image> that renders it and the preload entry, making them impossible to drift apart.
 */
export const SIZES = {
  /** full-bleed: intro grid, home carousel */
  full: "100vw",
  /** RightPanel's slide thumbnail */
  homeThumbnail: "16dvw",
} as const;

/** Rendered by <Image>, so preload resolves them through the optimizer. */
export const INTRO_BASE_IMAGE = "/preload1.webp";
export const INTRO_REVEAL_IMAGES = ["/preload2.png", "/preload3.png"];

/** CSS background-image — served verbatim, never through the optimizer. */
export const CSS_BACKGROUNDS: Asset[] = [
  { src: "/rightbg.png", raw: true },
  { src: "/megamenu.png", raw: true },
];

/** Everything the home screen paints once the intro hands off. */
export function homeAssets(slides: ResolvedHomeSlide[]): Asset[] {
  const backgrounds = [...new Set(slides.map((slide) => slide.background))];
  const thumbnails = [...new Set(slides.map((slide) => slide.thumbnail))];

  return [
    ...backgrounds.map((src) => ({ src, sizes: SIZES.full })),
    ...thumbnails.map((src) => ({ src, sizes: SIZES.homeThumbnail })),
    { src: INTRO_BASE_IMAGE, sizes: SIZES.full },
    ...CSS_BACKGROUNDS,
  ];
}

/** Work grid/list: WorkCard renders <Image fill> with no sizes, i.e. 100vw. */
export function workAssets(works: WorkItem[]): Asset[] {
  const srcs = [...new Set(works.flatMap((work) => [work.image, work.hoverImage]).filter(Boolean))];
  return srcs.map((src) => ({ src, sizes: SIZES.full }));
}

/** Curated carousel renders <Image width height> — fixed size, not fill. */
export function curatedAssets(items: CuratedSpaceItem[]): Asset[] {
  const seen = new Set<string>();
  return items
    .filter((item) => !seen.has(item.src) && seen.add(item.src))
    .map((item) => ({ src: item.src, width: item.width, height: item.height }));
}
