import Image from "next/image";
import styles from "./sections.module.css";
import type { IntroGalleryImageSlot, ProjectSection } from "@/lib/projects/types";

type SectionRendererProps = {
  sections: ProjectSection[];
};

export function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {sections.map((section) => (
        <Section key={section.id} section={section} />
      ))}
    </>
  );
}

const fallbackSlots: IntroGalleryImageSlot[] = ["left", "right", "center", "wide"];

function getIntroImageClass(slot: IntroGalleryImageSlot | undefined, index: number) {
  const resolvedSlot = slot ?? fallbackSlots[index % fallbackSlots.length];
  const classNameBySlot: Record<IntroGalleryImageSlot, string> = {
    left: styles.scatterSlotLeft,
    right: styles.scatterSlotRight,
    center: styles.scatterSlotCenter,
    wide: styles.scatterSlotWide,
  };

  return `${styles.scatterImage} ${classNameBySlot[resolvedSlot]}`;
}

function Section({ section }: { section: ProjectSection }) {
  switch (section.type) {
    case "hero":
      return (
        <section className={styles.hero}>
          <Image
            src={section.props.image.url}
            alt={section.props.image.alt}
            fill
            priority
            sizes="100vw"
            className={styles.coverImage}
          />
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <p>{section.props.eyebrow}</p>
            <h1>{section.props.title}</h1>
            <span>{section.props.subtitle}</span>
          </div>
        </section>
      );
    case "introGallery":
      return (
        <section className={styles.introGallery}>
          <div className={styles.introText}>
            <p>{section.props.label}</p>
            <h2>{section.props.heading}</h2>
            <span>{section.props.body}</span>
          </div>
          <div className={styles.galleryScatter}>
            {section.props.images.map((image, index) => (
              <div className={getIntroImageClass(image.slot, index)} key={`${image.url}-${index}`}>
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 700px) 82vw, 34vw"
                  className={styles.coverImage}
                />
              </div>
            ))}
          </div>
        </section>
      );
    case "imageStatement":
      return (
        <section className={styles.imageStatement}>
          <Image
            src={section.props.image.url}
            alt={section.props.image.alt}
            fill
            sizes="100vw"
            className={styles.coverImage}
          />
          <div className={styles.statementShade} />
          <p>{section.props.text}</p>
        </section>
      );
    case "richText":
      return (
        <section className={styles.richText}>
          <p>{section.props.body}</p>
        </section>
      );
    case "gallery":
      return (
        <section className={styles.galleryGrid}>
          {section.props.images.map((image) => (
            <div className={styles.gridImage} key={image.url}>
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 700px) 100vw, 50vw"
                className={styles.coverImage}
              />
            </div>
          ))}
        </section>
      );
    case "video":
      return (
        <section className={styles.videoEmbed}>
          <iframe
            src={section.props.url}
            title={section.props.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </section>
      );
    case "spacer":
      return <div className={styles[section.variant]} aria-hidden="true" />;
    default:
      return null;
  }
}
