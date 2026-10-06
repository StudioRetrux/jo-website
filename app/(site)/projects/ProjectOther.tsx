"use client";

import ProjectText from "./ProjectText";
import Image from "next/image";
import ProjectLink from "./ProjectLink";
import SectionLink from "../SectionLink";
import { useCursor } from "../contexts/CursorContext";
import type { DetailKind } from "./ProjectOverlay";
import styles from "./[slug]/projectDetail.module.css";

export type OtherItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  image: string;
  hoverImage?: string;
};

export default function ProjectOther({
  items,
  heading = "View other projects",
  viewAllHref = "/works",
  kind = "project",
  homeNavigation = "route",
  onLeave,
}: {
  items: OtherItem[];
  heading?: string;
  viewAllHref?: string;
  kind?: DetailKind;
  homeNavigation?: "state" | "route";
  onLeave?: () => void;
}) {
  const { setMode } = useCursor();
  if (items.length === 0) return null;

  return (
    <section className={styles.other}>
      <div className={styles.otherHead}>
        <ProjectText as="h2" className={styles.otherTitle}>{heading}</ProjectText>
        <SectionLink
          href={viewAllHref}
          mode={homeNavigation}
          onLeave={onLeave}
          className={styles.otherViewAll}
        >
          <ProjectText as="span">View all</ProjectText>
        </SectionLink>
      </div>
      <div className={styles.otherGrid}>
        {items.map((item) => (
          <ProjectLink
            key={item.id}
            kind={kind}
            slug={item.slug}
            className={styles.otherCard}
            onMouseEnter={() => setMode("view")}
            onMouseLeave={() => setMode("default")}
          >
            <div className={styles.otherImage}>
              <Image src={item.image} alt={item.title} fill sizes="(max-width: 480px) 78vw, 30vw" draggable={false} />
              {item.hoverImage && item.hoverImage !== item.image && (
                <Image
                  src={item.hoverImage}
                  alt=""
                  fill
                  sizes="(max-width: 480px) 78vw, 30vw"
                  draggable={false}
                  className={styles.otherHoverImage}
                />
              )}
            </div>
            <ProjectText as="span" className={styles.otherCardTitle}>{item.title}</ProjectText>
            <ProjectText as="span" className={styles.otherCardInfo}>
              {item.category}
              <span aria-hidden="true">{" • "}</span>
              {item.year}
            </ProjectText>
          </ProjectLink>
        ))}
      </div>
    </section>
  );
}
