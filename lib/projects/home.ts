import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";
import type { Project } from "./types";

// Home carousel = ordered selection of works. Every field optional —
// falls back to the referenced project's own data.
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

export async function getHomeConfig(): Promise<HomeConfig> {
  const row = await prisma.homeConfig.findUnique({ where: { id: 1 } });
  return row ? { slides: row.slides as HomeSlide[] } : { slides: [] };
}

export async function updateHomeConfig(config: HomeConfig): Promise<void> {
  const slides = config.slides as unknown as Prisma.InputJsonValue;
  await prisma.homeConfig.upsert({
    where: { id: 1 },
    create: { id: 1, slides },
    update: { slides },
  });
}
