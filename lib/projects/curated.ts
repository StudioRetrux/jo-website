import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";
import {
  DEFAULT_CURATED_SPACE_ITEMS,
  curatedSlug,
  type CuratedSpaceItem,
  type CuratedSpacesConfig,
} from "./curated-shared";

export * from "./curated-shared";

// Items for the curated spaces carousel; falls back to the hardcoded seed
// while no config has been saved.
export async function getCuratedSpaceItems(): Promise<CuratedSpaceItem[]> {
  const config = await getCuratedSpacesConfig();
  return config.items.length > 0 ? config.items : DEFAULT_CURATED_SPACE_ITEMS;
}

export type CuratedRelatedItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  image: string;
};

/**
 * A curated space plus up to `limit` others in its category. Shared by the route and
 * the overlay's API so both resolve a slug identically.
 */
export async function getCuratedDetail(
  slug: string,
  limit = 3,
): Promise<{ item: CuratedSpaceItem; related: CuratedRelatedItem[] } | null> {
  const items = await getCuratedSpaceItems();
  const item = items.find((entry) => curatedSlug(entry.title) === slug);
  if (!item) return null;

  // deduped by slug so a repeated title doesn't list the same space twice
  const seen = new Set([slug]);
  const related: CuratedRelatedItem[] = [];
  for (const entry of items) {
    const entrySlug = curatedSlug(entry.title);
    if (entry.category !== item.category || seen.has(entrySlug)) continue;
    seen.add(entrySlug);
    related.push({
      id: entrySlug,
      slug: entrySlug,
      title: entry.title,
      category: entry.category,
      year: entry.year,
      image: entry.src,
    });
    if (related.length === limit) break;
  }

  return { item, related };
}

export async function getCuratedSpacesConfig(): Promise<CuratedSpacesConfig> {
  const row = await prisma.curatedSpacesConfig.findUnique({ where: { id: 1 } });
  return row ? { items: row.items as CuratedSpaceItem[] } : { items: [] };
}

export async function updateCuratedSpacesConfig(config: CuratedSpacesConfig): Promise<void> {
  const items = config.items as unknown as Prisma.InputJsonValue;
  await prisma.curatedSpacesConfig.upsert({
    where: { id: 1 },
    create: { id: 1, items },
    update: { items },
  });
}
