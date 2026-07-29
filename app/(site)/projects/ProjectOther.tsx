import Image from "next/image";
import ProjectLink from "./ProjectLink";
import type { DetailKind } from "./ProjectOverlay";
import styles from "./[slug]/projectDetail.module.css";

export type OtherItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  image: string;
};

export default function ProjectOther({
  items,
  heading = "View other projects",
  viewAllHref = "/works",
  kind = "project",
}: {
  items: OtherItem[];
  heading?: string;
  viewAllHref?: string;
  kind?: DetailKind;
}) {
  if (items.length === 0) return null;

  return (
    <section className={styles.other}>
      <div className={styles.otherHead}>
        <h2 className={styles.otherTitle}>{heading}</h2>
        <a href={viewAllHref} className={styles.otherViewAll}>View all</a>
      </div>
      <div className={styles.otherGrid}>
        {items.map((item) => (
          <ProjectLink key={item.id} kind={kind} slug={item.slug} className={styles.otherCard}>
            <div className={styles.otherImage}>
              <Image src={item.image} alt={item.title} fill sizes="30vw" draggable={false} />
            </div>
            <span className={styles.otherCardTitle}>{item.title}</span>
            <span className={styles.otherCardInfo}>
              {item.category}
              <span aria-hidden="true">{" • "}</span>
              {item.year}
            </span>
          </ProjectLink>
        ))}
      </div>
    </section>
  );
}
