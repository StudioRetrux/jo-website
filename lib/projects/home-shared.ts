import { z } from "zod";
import type { Project } from "./types";

// Home carousel = ordered selection of works. Every field optional —
// falls back to the referenced project's own data.
// Client-safe module: no Prisma imports here.
export const homeSlideSchema = z.object({
  projectId: z.string().min(1),
  image: z.string().optional(), // left fullscreen bg; default project.thumbnail.url
  thumbnail: z.string().optional(), // right-panel small img; default project.hoverImage ?? thumbnail
  tag: z.string().optional(), // default "CATEGORY • YEAR"
  heading: z.string().optional(), // default project.title uppercased
  description: z.string().optional(), // default project.subtitle; "\n" = line break
});

export const homeConfigSchema = z.object({
  slides: z.array(homeSlideSchema),
});

export type HomeSlide = z.infer<typeof homeSlideSchema>;
export type HomeConfig = z.infer<typeof homeConfigSchema>;

export type ResolvedHomeSlide = {
  projectId: string;
  tag: string;
  heading: string;
  descLines: string[];
  background: string;
  thumbnail: string;
};

// Last-resort slides when the DB has zero published projects —
// keeps the carousel math (length, indicator) from ever hitting an empty array.
export const FALLBACK_HOME_SLIDES: ResolvedHomeSlide[] = [
  {
    projectId: "fallback",
    tag: "HOSPITALITY • 2025",
    heading: "AMAINAIA HOTEL KUTA",
    descLines: ["A calm, well-crafted space designed", "for comfort and ease."],
    background: "/preload4ld.png",
    thumbnail: "/preload4ld.png",
  },
];

export function resolveHomeSlide(slide: HomeSlide, project: Project): ResolvedHomeSlide {
  const background = slide.image ?? project.thumbnail.url;
  return {
    projectId: slide.projectId,
    tag: slide.tag ?? `${project.category} • ${project.year}`.toUpperCase(),
    heading: slide.heading ?? project.title.toUpperCase(),
    descLines: (slide.description ?? project.subtitle).split("\n"),
    background,
    thumbnail: slide.thumbnail ?? project.hoverImage?.url ?? background,
  };
}
