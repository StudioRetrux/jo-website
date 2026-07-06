import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";
import { getPublishedProjects } from "./data";
import {
  resolveHomeSlide,
  type HomeConfig,
  type HomeSlide,
  type ResolvedHomeSlide,
} from "./home-shared";

export * from "./home-shared";

// Slides for the home carousel; never empty while published projects exist —
// falls back to the 5 most recent published works when no config is saved.
export async function getResolvedHomeSlides(): Promise<ResolvedHomeSlide[]> {
  const [config, projects] = await Promise.all([
    getHomeConfig(),
    getPublishedProjects(),
  ]);
  const byId = new Map(projects.map((project) => [project.id, project]));

  const slides = config.slides.flatMap((slide) => {
    const project = byId.get(slide.projectId);
    return project ? [resolveHomeSlide(slide, project)] : [];
  });

  if (slides.length > 0) {
    return slides;
  }

  return projects
    .slice(0, 5)
    .map((project) => resolveHomeSlide({ projectId: project.id }, project));
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
