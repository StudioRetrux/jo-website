export type ImageAsset = {
  url: string;
  alt: string;
};

export type IntroGalleryImageSlot = "left" | "right" | "center" | "wide";

export type IntroGalleryImageAsset = ImageAsset & {
  slot?: IntroGalleryImageSlot;
};

export type ProjectSection =
  | {
      id: string;
      type: "hero";
      variant: "fullscreen";
      props: {
        eyebrow: string;
        title: string;
        subtitle: string;
        image: ImageAsset;
      };
    }
  | {
      id: string;
      type: "introGallery";
      variant: "asymmetric";
      props: {
        label: string;
        heading: string;
        body: string;
        images: IntroGalleryImageAsset[];
      };
    }
  | {
      id: string;
      type: "imageStatement";
      variant: "fullBleed";
      props: {
        text: string;
        image: ImageAsset;
      };
    }
  | {
      id: string;
      type: "richText";
      variant: "narrow";
      props: {
        body: string;
      };
    }
  | {
      id: string;
      type: "gallery";
      variant: "grid";
      props: {
        images: ImageAsset[];
      };
    }
  | {
      id: string;
      type: "video";
      variant: "embed";
      props: {
        url: string;
        title: string;
      };
    }
  | {
      id: string;
      type: "spacer";
      variant: "medium" | "large";
      props: Record<string, never>;
    };

export type Project = {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  thumbnail: ImageAsset;
  hoverImage?: ImageAsset;
  published: boolean;
  year: string;
  category: string;
  sections: ProjectSection[];
  createdAt: string;
  updatedAt: string;
};

// Flat view of a published project for the works grid/list.
// Layout is NOT part of the data — the grid assigns a template slot by position.
export type WorkItem = {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  hoverImage: string;
};
