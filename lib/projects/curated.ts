import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";
import {
  DEFAULT_CURATED_SPACE_ITEMS,
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
