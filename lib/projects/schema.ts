import { z } from "zod";

const imageAssetSchema = z.object({
  url: z.string().url(),
  alt: z.string().min(1),
});

const introGalleryImageSchema = imageAssetSchema.extend({
  slot: z.enum(["left", "right", "center", "wide"]).optional(),
});

const heroSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("hero"),
  variant: z.literal("fullscreen"),
  props: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    subtitle: z.string().min(1),
    image: imageAssetSchema,
  }),
});

const introGallerySectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("introGallery"),
  variant: z.literal("asymmetric"),
  props: z.object({
    label: z.string().min(1),
    heading: z.string().min(1),
    body: z.string().min(1),
    images: z.array(introGalleryImageSchema).min(1),
  }),
});

const imageStatementSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("imageStatement"),
  variant: z.literal("fullBleed"),
  props: z.object({
    text: z.string().min(1),
    image: imageAssetSchema,
  }),
});

const richTextSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("richText"),
  variant: z.literal("narrow"),
  props: z.object({
    body: z.string().min(1),
  }),
});

const gallerySectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("gallery"),
  variant: z.literal("grid"),
  props: z.object({
    images: z.array(imageAssetSchema).min(1),
  }),
});

const videoSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("video"),
  variant: z.literal("embed"),
  props: z.object({
    url: z.string().url(),
    title: z.string().min(1),
  }),
});

const spacerSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("spacer"),
  variant: z.enum(["medium", "large"]),
  props: z.object({}),
});

export const projectSectionSchema = z.discriminatedUnion("type", [
  heroSectionSchema,
  introGallerySectionSchema,
  imageStatementSectionSchema,
  richTextSectionSchema,
  gallerySectionSchema,
  videoSectionSchema,
  spacerSectionSchema,
]);

export const createProjectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().trim().optional().default(""),
});

export const workCardLayoutSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  row: z.boolean().optional(),
  marginLeft: z.string().optional(),
  marginTop: z.string().optional(),
  imageRevealDelayMs: z.number().nonnegative().optional(),
});

export const projectUpdateSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  subtitle: z.string().min(1),
  thumbnail: imageAssetSchema,
  hoverImage: imageAssetSchema.optional(),
  cardLayout: workCardLayoutSchema.optional(),
  published: z.boolean(),
  year: z.string().min(1),
  category: z.string().min(1),
  sections: z.array(projectSectionSchema),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
