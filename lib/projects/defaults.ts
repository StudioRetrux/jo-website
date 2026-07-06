import type { CreateProjectInput } from "./schema";
import type { ProjectSection } from "./types";

export type CmsSectionType = "hero" | "introGallery" | "imageStatement";

const placeholderImages = {
  hero: {
    url: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=2200&q=85",
    alt: "Cinematic bedroom interior",
  },
  galleryOne: {
    url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
    alt: "Warm interior lounge",
    slot: "left" as const,
  },
  galleryTwo: {
    url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=85",
    alt: "Moody bedroom lighting",
    slot: "right" as const,
  },
  galleryThree: {
    url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
    alt: "Refined suite seating",
    slot: "center" as const,
  },
  statement: {
    url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2200&q=85",
    alt: "Full bleed interior statement image",
  },
};

export function slugifyProjectTitle(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function createStarterSections(title: string): ProjectSection[] {
  return [
    {
      id: "hero-1",
      type: "hero",
      variant: "fullscreen",
      props: {
        eyebrow: "New Project",
        title,
        subtitle: "Write project summary here.",
        image: placeholderImages.hero,
      },
    },
    createSectionTemplate("introGallery", "intro-gallery-1"),
    createSectionTemplate("imageStatement", "image-statement-1"),
  ];
}

export function createStarterProject(input: CreateProjectInput) {
  const title = input.title.trim();

  return {
    title,
    slug: slugifyProjectTitle(input.slug || title),
    subtitle: "Write project summary here.",
    thumbnail: placeholderImages.hero,
    published: false,
    year: new Date().getFullYear().toString(),
    category: "Interior",
    sections: createStarterSections(title),
  };
}

export function createSectionTemplate(
  type: CmsSectionType,
  id: string,
): ProjectSection {
  if (type === "hero") {
    return {
      id,
      type: "hero",
      variant: "fullscreen",
      props: {
        eyebrow: "New Project",
        title: "Project Title",
        subtitle: "Write project summary here.",
        image: placeholderImages.hero,
      },
    };
  }

  if (type === "introGallery") {
    return {
      id,
      type: "introGallery",
      variant: "asymmetric",
      props: {
        label: "[About]",
        heading: "Introduce project intent, mood, and transformation.",
        body: "Use this section for editorial context and supporting description.",
        images: [
          placeholderImages.galleryOne,
          placeholderImages.galleryTwo,
          placeholderImages.galleryThree,
        ],
      },
    };
  }

  return {
    id,
    type: "imageStatement",
    variant: "fullBleed",
    props: {
      text: "Use this space for strongest visual statement from project.",
      image: placeholderImages.statement,
    },
  };
}
