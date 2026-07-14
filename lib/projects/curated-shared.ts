import { z } from "zod";

// Curated spaces carousel = ordered list of standalone images with captions.
// Client-safe module: no Prisma imports here.
export const curatedSpaceItemSchema = z.object({
  src: z.string().min(1),
  width: z.number().positive(),
  height: z.number().positive(),
  title: z.string().min(1),
  category: z.string().min(1),
  year: z.string().min(1),
});

export const curatedSpacesConfigSchema = z.object({
  items: z.array(curatedSpaceItemSchema),
});

export type CuratedSpaceItem = z.infer<typeof curatedSpaceItemSchema>;
export type CuratedSpacesConfig = z.infer<typeof curatedSpacesConfigSchema>;

// Seed/fallback: the original hardcoded carousel — used when no config is
// saved yet, and as the admin editor's starting point.
export const DEFAULT_CURATED_SPACE_ITEMS: CuratedSpaceItem[] = [
  { src: "/cs1.png", width: 352, height: 235, title: "Cafe In Laws", category: "Hospitality", year: "2025" },
  { src: "/cs2.png", width: 626, height: 417, title: "Cafe In Laws", category: "Hospitality", year: "2025" },
  { src: "/cs4.png", width: 496, height: 331, title: "Audi Dental Denpasar", category: "Healthcare", year: "2025" },
  { src: "/cs3.png", width: 626, height: 417, title: "Audi Dental Denpasar", category: "Healthcare", year: "2025" },
];
