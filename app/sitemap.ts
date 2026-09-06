import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/projects/data";
import { getCuratedSpaceItems } from "@/lib/projects/curated";
import { curatedSlug } from "@/lib/projects/curated-shared";
import { SITE } from "./site";

export const runtime = "nodejs";
// Built per request, not at build time: the entries come from the database, and a
// build shouldn't need one. Unpublishing a project drops it from the sitemap at once.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [projects, curated] = await Promise.all([
    getPublishedProjects(),
    getCuratedSpaceItems(),
  ]);

  // Curated items have no slug column — the title is the identity, same as the routes.
  const curatedSlugs = [...new Set(curated.map((item) => curatedSlug(item.title)))];

  return [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.url}/works`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/curratedspaces`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    ...projects.map((project) => ({
      url: `${SITE.url}/works/${project.slug}`,
      lastModified: new Date(project.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...curatedSlugs.map((slug) => ({
      url: `${SITE.url}/curratedspaces/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
