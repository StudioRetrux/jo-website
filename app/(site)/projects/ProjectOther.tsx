import Image from "next/image";
import ProjectLink from "./ProjectLink";
import type { WorkItem } from "@/lib/projects/types";
import styles from "./[slug]/projectDetail.module.css";

export default function ProjectOther({ items }: { items: WorkItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className={styles.other}>
      <div className={styles.otherHead}>
        <h2 className={styles.otherTitle}>View other projects</h2>
        <a href="/works" className={styles.otherViewAll}>View all</a>
      </div>
      <div className={styles.otherGrid}>
        {items.map((item) => (
          <ProjectLink key={item.id} slug={item.slug} className={styles.otherCard}>
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
